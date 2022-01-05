import bcrypt from 'bcrypt';
import { SqliteError } from 'better-sqlite3';
import Cookies from 'cookies';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createUser } from '../../../db/auth';
import { RegisterFormSchema, SECRET_KEY } from '../../../lib/auth';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST')
        return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: ReasonPhrases.METHOD_NOT_ALLOWED });

    try {
        const { email, password } = RegisterFormSchema.parse(req.body);

        const passwordHash = await bcrypt.hash(password, 14);
        const user = createUser({ email, passwordHash, ownsContent: {} });
        const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
        const token = jwt.sign(
            {
                exp,
                user: user.id,
            },
            SECRET_KEY,
        );
        const cookies = new Cookies(req, res);
        cookies.set('token', token, { httpOnly: true, expires: new Date(exp) });
        return res.status(StatusCodes.OK).json({ email });
    } catch (error) {
        let message: string;
        if (error instanceof SqliteError) {
            message = 'A user with this email already exists.';
        } else {
            message = ReasonPhrases.BAD_REQUEST;
        }
        return res.status(StatusCodes.BAD_REQUEST).json({ error: message });
    }
};
