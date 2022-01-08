import { DiceRoll, DiceRollSchema } from '../lib/dice';
import { pool, sql } from './client';

export async function createDiceRoll(roll: DiceRoll, userId: number, campaignId?: number | null) {
    const result = await pool.query<DiceRoll>(
        sql`INSERT INTO dicerolls ("userId", type, amount, result, "campaignId") VALUES (${userId}, ${roll.type}, ${
            roll.amount
        }, ${JSON.stringify(roll.result)}, ${campaignId ?? null}) RETURNING *;`,
    );
    return DiceRollSchema.parse(result.rows[0]);
}

export async function getDiceRolls(userId: number, campaignId?: number | null) {
    const result = await pool.query<DiceRoll>(
        sql`SELECT * FROM dicerolls WHERE "userId" = ${userId} AND "campaignId" = ${campaignId} OR "campaignId" IS NULL ORDER BY "createdAt" DESC LIMIT 20;`,
    );

    return result.rows.map((dr) => DiceRollSchema.parse(dr));
}
