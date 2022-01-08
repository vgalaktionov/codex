import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getActiveCampaign } from '../../../db/campaigns';
import { getDiceRolls } from '../../../db/dice';
import { getUserId } from '../../../lib/auth';
import { log } from '../../../lib/util';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET')
        return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: ReasonPhrases.METHOD_NOT_ALLOWED });

    try {
        const userId = getUserId(req, res);
        const campaignId = (await getActiveCampaign(userId))?.id;
        const history = await getDiceRolls(userId, campaignId);
        return res.status(StatusCodes.OK).json({ history });
    } catch (error) {
        log.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};
