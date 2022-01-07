import { z } from 'zod';
import { RuleCategory, RuleSchema } from './base';

export const SpellSchema = RuleSchema.extend({
    category: z.literal(RuleCategory.SPELL),
    type: z.string().min(1),
    level: z.number().int().min(0),
    castingTime: z.string().min(1),
    range: z.string().min(1),
    components: z.string().optional().nullable(),
    duration: z.string().min(1),
});
export type Spell = z.infer<typeof SpellSchema>;
