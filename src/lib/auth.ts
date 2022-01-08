import Cookies from 'cookies';
import { IncomingMessage, ServerResponse } from 'http';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { BaseDBSchema } from './util';

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

export const UserSchema = BaseDBSchema.extend({
    email: z.string().email(),
    passwordHash: z.string().min(1),
    ownsContent: z.object({}).optional().nullable(),
});
export type User = z.infer<typeof UserSchema>;

export const PUBLIC_ROUTES = ['/', '/login', '/register', '/api/auth/login', '/api/auth/register', '/site.webmanifest'];

export const getUserId = (req: IncomingMessage, res: ServerResponse) => {
    const cookies = new Cookies(req, res);
    const { user: userId } = jwt.verify(cookies.get('token') ?? '', SECRET_KEY) as { user: number };
    return userId;
};
