import bcrypt from 'bcrypt';
import Cookies from 'cookies';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserByEmail } from '../../../db/auth';
import { LoginFormSchema, SECRET_KEY } from '../../../lib/auth';
import { log } from '../../../lib/util';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST')
        return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: ReasonPhrases.METHOD_NOT_ALLOWED });

    try {
        const { email, password } = LoginFormSchema.parse(req.body);

        const user = getUserByEmail(email);
        if (!(await bcrypt.compare(password, user.passwordHash)))
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Username and password did not match.' });
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
        log.error(error);
        return res.status(StatusCodes.UNAUTHORIZED).json({ error });
    }
};
