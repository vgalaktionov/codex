import { User } from '../lib/auth';
import { Character, CharacterSchema } from '../lib/characters';
import { pool, sql } from './client';

export async function getCharacters(userId: number): Promise<Character[]> {
    const result = await pool.query<Character>(sql`SELECT * FROM characters WHERE "userId" = ${userId};`);
    return result.rows.map((r) => CharacterSchema.parse(r));
}

export async function createCharacter(character: Character, userId: number, campaignId: number): Promise<Character> {
    const client = await pool.connect();
    try {
        await client.query(sql`BEGIN;`);
        await client.query(sql`UPDATE characters SET active = false WHERE "userId" = ${userId};`);
        const result = await client.query(
            sql`
            INSERT INTO characters (
                "userId",
                "campaignId",
                name,
                race,
                subrace,
                classes,
                age,
                alignment,
                ideals,
                bonds,
                flaws,
                background,
                looks,
                image,
                strength,
                dexterity,
                constitution,
                intelligence,
                wisdom,
                charisma,
                inventory,
                spells
            )
            VALUES (
                ${userId},
                ${campaignId},
                ${character.name},
                ${character.race},
                ${character.subrace},
                ${character.classes},
                ${character.age},
                ${character.alignment},
                ${character.ideals},
                ${character.bonds},
                ${character.flaws},
                ${character.background},
                ${character.looks},
                ${character.image},
                ${character.strength},
                ${character.dexterity},
                ${character.constitution},
                ${character.intelligence},
                ${character.wisdom},
                ${character.charisma},
                ${character.inventory},
                ${character.spells},
            ) RETURNING *;`,
        );
        await client.query(sql`COMMIT;`);
        return CharacterSchema.parse(result.rows[0]);
    } catch (error) {
        await client.query(sql`ROLLBACK;`);
        throw error;
    } finally {
        client.release();
    }
}

export async function getActiveCharacter(campaignId: number, userId: number): Promise<Character | undefined> {
    const result = await pool.query<User>(
        sql`SELECT * FROM characters WHERE "userId" = ${userId} AND "campaignId" = ${campaignId} AND active;`,
    );
    return result.rows.length === 1 ? CharacterSchema.parse(result.rows[0]) : undefined;
}

export async function setActiveCharacter(characterId: number, campaignId: number, userId: number): Promise<void> {
    const client = await pool.connect();
    try {
        await client.query(sql`BEGIN;`);
        await client.query(
            sql`UPDATE characters SET active = false WHERE "userId" = ${userId} AND campaignId = ${campaignId};`,
        );
        const result = await client.query(
            sql`UPDATE characters SET active = true WHERE "userId" = ${userId} AND id = ${characterId};`,
        );
        await client.query(sql`COMMIT;`);
    } catch (error) {
        await client.query(sql`ROLLBACK;`);
        throw error;
    } finally {
        client.release();
    }
}
