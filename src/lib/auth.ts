import { z } from 'zod';

export const SECRET_KEY =
    process.env.SECRET_KEY ?? '97ab01312237cc6532ca9f95a10f078b56899c2993914a5c9a569950117844492834030d';

export const RegisterFormSchema = z
    .object({
        email: z.string().email(),
        password: z.string().min(8),
        confirmPassword: z.string(),
    })
    .refine((rs) => rs.password === rs.confirmPassword, 'Passwords must match.');
export type RegisterForm = z.infer<typeof RegisterFormSchema>;

export const LoginFormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});
export type LoginForm = z.infer<typeof LoginFormSchema>;

export const UserSchema = z.object({
    id: z.number().int().positive().optional(),
    email: z.string().email(),
    passwordHash: z.string().min(1),
    ownsContent: z.object({}).optional().nullable(),
});
export type User = z.infer<typeof UserSchema>;
