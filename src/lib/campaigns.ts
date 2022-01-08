import { z } from 'zod';
import { BaseDBSchema } from './util';

export const CampaignSchema = BaseDBSchema.extend({
    id: z.number().int().positive().optional().nullable(),
    name: z.string().min(3),
    description: z.string(),
    active: z.boolean().optional(),
});
export type Campaign = z.infer<typeof CampaignSchema>;
