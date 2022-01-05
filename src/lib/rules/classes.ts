import { z } from 'zod';
import { RuleCategory, RuleSchema } from './base';

export const ClassSchema = RuleSchema.extend({ category: z.literal(RuleCategory.CLASS) });
export type Class = z.infer<typeof ClassSchema>;
