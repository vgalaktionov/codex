import { z } from 'zod';
import { GetOrChooseSchema, RuleCategory, RuleSchema } from './base';

export const AbilityScoreIncreaseSchema = GetOrChooseSchema(
    z.object({
        strength: z.number().int().optional(),
        dexterity: z.number().int().optional(),
        constitution: z.number().int().optional(),
        intelligence: z.number().int().optional(),
        wisdom: z.number().int().optional(),
        charisma: z.number().int().optional(),
    }),
    ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'],
);
export type AbilityScoreIncrease = z.infer<typeof AbilityScoreIncreaseSchema>;
export const SpeedSchema = z.number().int().positive();

export type Speed = z.infer<typeof SpeedSchema>;

export const RacialTraitSchema = z.record(
    z.union([z.string().min(3), z.literal('Ability Score Increase'), z.literal('Speed')]),
    z.nullable(
        z.object({
            description: z.string().optional(),
            value: z.union([AbilityScoreIncreaseSchema, SpeedSchema]).optional(),
        }),
    ),
);

export const RaceSchema = RuleSchema.extend({ category: z.literal(RuleCategory.RACE), traits: RacialTraitSchema });
export type Race = z.infer<typeof RaceSchema>;
