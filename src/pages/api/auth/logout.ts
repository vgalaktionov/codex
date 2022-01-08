import Cookies from 'cookies';
import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const cookies = new Cookies(req, res);
    cookies.set('token', null, { httpOnly: true });
    return res.status(StatusCodes.NO_CONTENT);
};
