import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getRulesLinks } from '../../../db/rules';
import { log } from '../../../lib/util';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET')
        return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: ReasonPhrases.METHOD_NOT_ALLOWED });

    try {
        const rulesLinks = await getRulesLinks();
        return res.status(StatusCodes.OK).json({ rulesLinks });
    } catch (error) {
        log.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};
