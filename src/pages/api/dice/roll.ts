import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getActiveCampaign } from '../../../db/campaigns';
import { createDiceRoll } from '../../../db/dice';
import { getUserId } from '../../../lib/auth';
import { DiceRollSchema } from '../../../lib/dice';
import { log } from '../../../lib/util';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST')
        return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: ReasonPhrases.METHOD_NOT_ALLOWED });

    try {
        const userId = getUserId(req, res);
        const campaignId = (await getActiveCampaign(userId))?.id ?? null;
        const roll = await createDiceRoll(DiceRollSchema.parse(req.body), userId, campaignId);
        return res.status(StatusCodes.OK).json({ roll });
    } catch (error) {
        log.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};
