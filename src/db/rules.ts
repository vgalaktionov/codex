import { User } from '../lib/auth';
import { DBRule, Rule } from '../lib/rules/base';
import { database, sql } from './client';

export async function upsertRule(rule: Rule, user?: User) {
    const db = await database;
    await db.get<DBRule & { rule: string }>(sql`
        INSERT INTO rules (userId, category, name, description, rule)
        VALUES (${user?.id ?? null}, ${rule.category}, ${rule.name}, ${rule.description}, ${JSON.stringify(rule)})
        ON CONFLICT (userId, category, name) DO UPDATE SET description = excluded.description, rule = excluded.rule;`);
}
