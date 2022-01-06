import fs from 'fs/promises';
import matter from 'gray-matter';
import path from 'path';
import { ZodSchema } from 'zod';
import { upsertRule } from '../../db/rules';
import { log } from '../util';
import { GeneralRuleSchema, resolveDescriptionsFromContent, Rule, RuleCategory } from './base';
import { ClassSchema } from './classes';
import { RaceSchema } from './races';
import { SubraceSchema } from './subraces';

// const ALL_RULES = [GeneralRule, Race, Subrace, Class];

interface RuleConfig {
    category: RuleCategory;
    defaultPath: string;
    schema: ZodSchema<Rule>;
}

const ALL_RULES: Readonly<RuleConfig[]> = [
    { category: RuleCategory.GENERAL, defaultPath: 'rules/general', schema: GeneralRuleSchema },
    { category: RuleCategory.RACE, defaultPath: 'rules/races', schema: RaceSchema },
    { category: RuleCategory.SUBRACE, defaultPath: 'rules/subraces', schema: SubraceSchema },
    { category: RuleCategory.CLASS, defaultPath: 'rules/classes', schema: ClassSchema },
] as const;

export async function loadDefaultRules(verbose = false) {
    verbose && log.info('Loading default rules...');

    try {
        await Promise.all(
            ALL_RULES.map(async (config) => {
                const files = await fs.readdir(config.defaultPath);
                verbose && log.info({ category: config.category, files });

                await Promise.all(
                    files.map(async (fileName) => {
                        const raw = await fs.readFile(path.join(config.defaultPath, fileName), 'utf-8');
                        const parsed = matter(raw);
                        const validated = await config.schema.parseAsync({
                            ...parsed.data,
                            description: parsed.content,
                            category: config.category,
                        });
                        resolveDescriptionsFromContent(validated);
                        verbose && log.info(validated);

                        await upsertRule(validated);
                    }),
                );
            }),
        );
    } catch (error) {
        log.error('Failed to load default rules: ', error);
        throw error;
    }

    verbose && log.info('Loaded default rules successfully!');
}
