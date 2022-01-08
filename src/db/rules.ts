import { User } from '../lib/auth';
import { CharacterOptions, CharacterOptionsSchema } from '../lib/characters';
import {
    DBRule,
    DBRuleSchema,
    linkHref,
    Rule,
    RuleCategory,
    RuleLinks,
    RuleLinksSchema,
    RuleSchema,
    StandardRule,
} from '../lib/rules/base';
import { pool, sql } from './client';

export async function upsertRule(rule: Rule, user?: User) {
    await pool.query(sql`
        INSERT INTO rules ("userId", category, name, description, rule)
        VALUES (${user?.id ?? null}, ${rule.category}, ${rule.name}, ${rule.description}, ${JSON.stringify(rule)})
        ON CONFLICT (COALESCE("userId", 0), category, name) DO UPDATE SET description = excluded.description, rule = excluded.rule;`);
}

export async function getRulesLinks(user?: User): Promise<RuleLinks> {
    const result = await pool.query<Rule>(sql`
        SELECT * FROM rules WHERE "userId" IS NULL;`);

    return RuleLinksSchema.parse(
        result.rows.reduce((acc, cur) => {
            if (acc[cur.category] == null) {
                acc[cur.category] = { [cur.name]: { href: linkHref(cur) } };
            } else {
                acc[cur.category][cur.name] = { href: linkHref(cur) };
            }
            return acc;
        }, {} as RuleLinks),
    );
}

export async function getRule(category: string, name: string, user?: User): Promise<Rule | undefined> {
    const result = await pool.query<Rule>(sql`
        SELECT * FROM rules WHERE UPPER(category) = ${category.toUpperCase()} AND UPPER(name) = ${name.toUpperCase()};`);
    return result.rows?.[0] ? RuleSchema.parse(result.rows[0]) : undefined;
}

export async function searchRules(query: string, user?: User): Promise<DBRule[]> {
    const processed = query
        .split(/\s+/)
        .map((p) => p + ':*')
        .join('<->');
    const result = await pool.query<DBRule>(sql`
        WITH q as (
            SELECT to_tsquery('english', ${processed}) AS query),
            ranked AS(
                SELECT *, ts_rank_cd("descriptionSearch", query) AS rank
                FROM  rules, q
                WHERE query @@ "descriptionSearch"
                ORDER by rank DESC
                LIMIT 10
            )
        SELECT *, ts_headline(description, q.query, 'StartSel = \`, StopSel = \`') as highlighted
        FROM ranked, q
        ORDER BY ranked DESC;
        `);

    return result.rows.map((r) => DBRuleSchema.parse(r));
}

export async function getCharacterOptions(userId: number, campaignId?: number): Promise<CharacterOptions> {
    const {
        rows: [{ description: racesDescription }],
    } = await pool.query<Rule>(
        sql`SELECT * FROM rules WHERE "userId" = ${userId} OR "userId" IS NULL AND category = ${RuleCategory.GENERAL} AND name = ${StandardRule.RACES} LIMIT 1;`,
    );
    const { rows: racesOptions } = await pool.query<Pick<DBRule, 'category' | 'name' | 'rule' | 'description'>>(
        sql`SELECT category, name, rule, description FROM rules WHERE "userId" = ${userId} OR "userId" IS NULL AND category = ${RuleCategory.RACE};`,
    );

    return CharacterOptionsSchema.parse({
        races: { description: racesDescription, options: racesOptions },
    });
}
