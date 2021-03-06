import { z } from 'zod';
import { ClassSchema } from '../rules/classes';
import { RaceSchema } from '../rules/races';
import { SubraceSchema } from '../rules/subraces';
import { BaseDBSchema } from '../util';

export const CharacterSchema = BaseDBSchema.extend({
    userId: z.number().int().positive().optional().nullable(),
    campaignId: z.number().int().positive().optional().nullable(),
    active: z.boolean(),
    name: z.string().min(2),
    level: z.number().int().min(2),
    race: z.string().min(2),
    subrace: z.string().optional().nullable(),
    classes: z.array(z.string().min(1)).min(1),
    age: z.string().optional().nullable(),
    alignment: z.string().min(1),
    ideals: z.string().optional().nullable(),
    bonds: z.string().optional().nullable(),
    flaws: z.string().optional().nullable(),
    background: z.string().optional().nullable(),
    looks: z.string().optional().nullable(),
    image: z
        .union([z.string(), z.any().refine((b) => b instanceof Uint8Array)])
        .optional()
        .nullable(),
    strength: z.number().int().positive(),
    dexterity: z.number().int().positive(),
    constitution: z.number().int().positive(),
    intelligence: z.number().int().positive(),
    wisdom: z.number().int().positive(),
    charisma: z.number().int().positive(),
    inventory: z.array(z.any()),
    spells: z.array(z.any()),
});

export type Character = z.infer<typeof CharacterSchema>;

export const NewCharacterSchema = CharacterSchema.omit({ classes: true }).extend({
    class: z.string().min(2),
});

export type NewCharacter = z.infer<typeof NewCharacterSchema>;

export const AbilitiesSchema = NewCharacterSchema.pick({
    charisma: true,
    strength: true,
    intelligence: true,
    dexterity: true,
    constitution: true,
    wisdom: true,
});
export type Abilities = z.infer<typeof AbilitiesSchema>;

export const CharacterOptionsSchema = z.object({
    races: z.object({
        description: z.string().min(1),
        options: z.array(RaceSchema),
    }),
    subraces: z.object({
        options: z.array(SubraceSchema),
    }),
    classes: z.object({
        description: z.string().min(1),
        options: z.array(ClassSchema),
    }),
});
export type CharacterOptions = z.infer<typeof CharacterOptionsSchema>;
