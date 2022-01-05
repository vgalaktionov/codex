import { z } from 'zod';
import { RuleCategory } from './base';
import { RaceSchema } from './races';

export const SubraceSchema = RaceSchema.extend({ category: z.literal(RuleCategory.SUBRACE) });
export type Subrace = z.infer<typeof SubraceSchema>;
