import { z, ZodSchema } from 'zod';
import { Race } from './races';
import { Subrace } from './subraces';

export enum RuleCategory {
    RACE = 'Race',
    SUBRACE = 'Subrace',
    CLASS = 'Class',
    GENERAL = 'General',
}

export const RuleSchema = z.object({
    name: z.string().min(1),
    description: z.string(),
    category: z.nativeEnum(RuleCategory),
});
export type Rule = z.infer<typeof RuleSchema>;

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

export const DBRuleSchema = RuleSchema.extend({
    id: z.number().int().positive(),
    rule: RuleSchema,
});
export type DBRule = z.infer<typeof DBRuleSchema>;

export const GetOrChooseSchema = <T>(schema: ZodSchema<T>, options: readonly [string, ...string[]]) =>
    z.object({
        get: schema,
        choose: z.array(
            z.object({
                amount: z.number().int().default(0),
                options: z.enum(options),
            }),
        ),
    });