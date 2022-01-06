import { User } from '../lib/auth';
import { linkHref, Rule, RuleLinks, RuleLinksSchema } from '../lib/rules/base';
import { database, sql } from './client';

export async function upsertRule(rule: Rule, user?: User) {
    const db = await database;
    await db.exec(sql`
        INSERT INTO rules (userId, category, name, description, rule)
        VALUES (${user?.id ?? null}, ${rule.category}, ${rule.name}, ${rule.description}, ${JSON.stringify(rule)})
        ON CONFLICT (userId, category, name) DO UPDATE SET description = excluded.description, rule = excluded.rule;`);
}

export async function getRulesLinks(user?: User): Promise<RuleLinks> {
    const db = await database;
    const rules = await db.all<Rule[]>(sql`
        SELECT * FROM rules WHERE userId IS NULL;`);

    return RuleLinksSchema.parse(
        rules.reduce((acc, cur) => {
            if (acc[cur.category] == null) {
                acc[cur.category] = { [cur.name]: { href: linkHref(cur) } };
            } else {
                acc[cur.category][cur.name] = { href: linkHref(cur) };
            }
            return acc;
        }, {} as RuleLinks),
    );
}
