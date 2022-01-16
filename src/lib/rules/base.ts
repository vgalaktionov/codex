import { z, ZodSchema } from 'zod';
import { User } from '../auth';
import { BaseDBSchema } from '../util';
import { Class } from './classes';
import { Race } from './races';
import { Subrace } from './subraces';

export enum RuleCategory {
    RACE = 'Race',
    SUBRACE = 'Subrace',
    CLASS = 'Class',
    GENERAL = 'General',
    SPELL = 'Spell',
}

export const RuleSchema = z.object({
    name: z.string().min(1),
    description: z.string(),
    category: z.nativeEnum(RuleCategory),
});
export type Rule = z.infer<typeof RuleSchema>;

export enum StandardRule {
    RACES = 'Races',
    CLASSES = 'Classes',
}

export const GeneralRuleSchema = RuleSchema.extend({ category: z.literal(RuleCategory.GENERAL) });
export type GeneralRule = z.infer<typeof GeneralRuleSchema>;

export function resolveDescriptionsFromContent(rule: Rule) {
    switch (rule.category) {
        case RuleCategory.RACE:
        case RuleCategory.SUBRACE: {
            const race = rule as Race | Subrace;
            const traitPattern = /\*\*([A-Za-z\.\s]+)\*\*(.*)/gm;
            for (const match of rule.description.matchAll(traitPattern)) {
                const [_, name, content] = match;
                const cleanName = name.trim().replace('.', '');
                if (cleanName in race.traits) {
                    if (race.traits[cleanName] != null) {
                        race.traits[cleanName]!.description = content.trim();
                    } else {
                        race.traits[cleanName] = { description: content.trim() };
                    }
                }
            }
        }
    }
}

export const linkHref = (rule: Rule) =>
    `/app/rules/${rule.category.toLowerCase()}/${encodeURIComponent(rule.name.toLowerCase())}`;

export const render = (rule?: Rule, user?: User) => {
    return rule?.description ?? '';
};

export const DBRuleSchema = RuleSchema.merge(BaseDBSchema).extend({
    rule: RuleSchema,
    highlighted: z.string().optional().nullable(),
});
export type DBRule<T = Rule> = z.infer<typeof DBRuleSchema> & { rule: T };

export const narrowDBRule = (rule: DBRule) => {
    switch (rule.category) {
        case RuleCategory.RACE:
            return rule as DBRule<Race>;
        case RuleCategory.SUBRACE:
            return rule as DBRule<Subrace>;
        case RuleCategory.CLASS:
            return rule as DBRule<Class>;
        default:
            return rule;
    }
};

export const GetOrChooseSchema = <T>(schema: ZodSchema<T>, options: readonly [string, ...string[]]) =>
    z.object({
        get: schema,
        choose: z
            .object({
                amount: z.number().int().default(0),
                choices: z.array(z.enum(options)),
            })
            .optional(),
    });

export const RuleLinksSchema = z.record(
    z.nativeEnum(RuleCategory),
    z.record(z.string().min(1), z.object({ href: z.string().min(1) })),
);
export type RuleLinks = z.infer<typeof RuleLinksSchema>;
