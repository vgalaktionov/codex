import bcrypt from 'bcrypt';
import Cookies from 'cookies';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createUser } from '../../../db/auth';
import { RegisterFormSchema, SECRET_KEY } from '../../../lib/auth';
import { log } from '../../../lib/util';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST')
        return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: ReasonPhrases.METHOD_NOT_ALLOWED });

    try {
        const { email, password } = RegisterFormSchema.parse(req.body);

        const passwordHash = await bcrypt.hash(password, 14);
        const user = await createUser({ email, passwordHash, ownsContent: {} });
        const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
        const token = jwt.sign(
            {
                exp,
                user: user.id,
            },
            SECRET_KEY,
        );
        const cookies = new Cookies(req, res);
        cookies.set('token', token, { httpOnly: true, expires: new Date(exp * 1000) });
        return res.status(StatusCodes.OK).json({ email });
    } catch (error) {
        log.error(error);
        return res.status(StatusCodes.BAD_REQUEST).json({ error: ReasonPhrases.BAD_REQUEST });
    }
};
