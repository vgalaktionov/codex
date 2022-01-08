import { User } from '../lib/auth';
import { Campaign, CampaignSchema } from '../lib/campaigns';
import { pool, sql } from './client';

export async function getCampaigns(userId: number): Promise<Campaign[]> {
    const result = await pool.query<Campaign>(sql`SELECT * FROM campaigns WHERE "userId" = ${userId};`);
    return result.rows.map((r) => CampaignSchema.parse(r));
}

export async function createCampaign(campaign: Campaign, userId: number): Promise<Campaign> {
    const client = await pool.connect();
    try {
        await client.query(sql`BEGIN;`);
        await client.query(sql`UPDATE campaigns SET active = false WHERE "userId" = ${userId};`);
        const result = await client.query(
            sql`INSERT INTO campaigns (name, description, "userId") VALUES (${campaign.name}, ${campaign.description}, ${userId}) RETURNING *;`,
        );
        await client.query(sql`COMMIT;`);
        return CampaignSchema.parse(result.rows[0]);
    } catch (error) {
        await client.query(sql`ROLLBACK;`);
        throw error;
    } finally {
        client.release();
    }
}

export async function getActiveCampaign(userId: number): Promise<Campaign | undefined> {
    const result = await pool.query<User>(sql`SELECT * FROM campaigns WHERE "userId" = ${userId} AND active;`);
    return result.rows.length === 1 ? CampaignSchema.parse(result.rows[0]) : undefined;
}

export async function setActiveCampaign(campaignId: number, userId: number): Promise<void> {
    const client = await pool.connect();
    try {
        await client.query(sql`BEGIN;`);
        await client.query(sql`UPDATE campaigns SET active = false WHERE "userId" = ${userId};`);
        const result = await client.query(
            sql`UPDATE campaigns SET active = true WHERE "userId" = ${userId} AND id = ${campaignId};`,
        );
        await client.query(sql`COMMIT;`);
    } catch (error) {
        await client.query(sql`ROLLBACK;`);
        throw error;
    } finally {
        client.release();
    }
}
