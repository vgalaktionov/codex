import { z } from 'zod';

export const SearchFormSchema = z.object({ q: z.string().min(2) });
export type SearchForm = z.infer<typeof SearchFormSchema>;
