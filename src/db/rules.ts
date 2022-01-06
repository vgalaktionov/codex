import { User } from '../lib/auth';
import { linkHref, Rule, RuleLinks, RuleLinksSchema, RuleSchema } from '../lib/rules/base';
import sql from './client';

export async function upsertRule(rule: Rule, user?: User) {
    await sql`
        INSERT INTO rules ("userId", category, name, description, rule)
        VALUES (${user?.id ?? null}, ${rule.category}, ${rule.name}, ${rule.description}, ${JSON.stringify(rule)})
        ON CONFLICT ("userId", category, name) DO UPDATE SET description = excluded.description, rule = excluded.rule;`;
}

export async function getRulesLinks(user?: User): Promise<RuleLinks> {
    const rules = await sql<Rule[]>`
        SELECT * FROM rules WHERE "userId" IS NULL;`;

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

export async function getRule(category: string, name: string, user?: User): Promise<Rule | undefined> {
    const [rule] = await sql<Rule[]>`
        SELECT * FROM rules WHERE UPPER(category) = ${category.toUpperCase()} AND UPPER(name) = ${name.toUpperCase()};`;
    return rule ? RuleSchema.parse(rule) : rule;
}

export async function searchRules(query: string, user?: User): Promise<Rule[]> {
    const rules = await sql<Rule[]>`
        SELECT *
        FROM rules
        WHERE "descriptionSearch" @@ to_tsquery('english', ${query});
        `;

    return rules.map((r) => RuleSchema.parse(r));
}
