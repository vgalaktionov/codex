import { z } from 'zod';
import { GetOrChooseSchema, RuleCategory, RuleSchema } from './base';

export const AbilityScoreIncreaseSchema = GetOrChooseSchema(
    z.object({
        strength: z.number().int(),
        dexterity: z.number().int(),
        constitution: z.number().int(),
        intelligence: z.number().int(),
        wisdom: z.number().int(),
        charisma: z.number().int(),
    }),
    ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'],
);
export type AbilityScoreIncrease = z.infer<typeof AbilityScoreIncreaseSchema>;
export const SpeedSchema = z.number().int().positive();

export type Speed = z.infer<typeof SpeedSchema>;

export const RacialTraitSchema = z.record(
    z.string().min(3),
    z.nullable(
        z.object({
            description: z.string().optional(),
            value: z.union([AbilityScoreIncreaseSchema, SpeedSchema]).optional(),
        }),
    ),
);

export const RaceSchema = RuleSchema.extend({ category: z.literal(RuleCategory.RACE), traits: RacialTraitSchema });
export type Race = z.infer<typeof RaceSchema>;
