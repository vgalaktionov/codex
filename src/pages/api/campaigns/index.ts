import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createCampaign, getCampaigns } from '../../../db/campaigns';
import { getUserId } from '../../../lib/auth';
import { CampaignSchema } from '../../../lib/campaigns';
import { log } from '../../../lib/util';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'GET': {
            try {
                const userId = getUserId(req, res);

                const campaigns = await getCampaigns(userId);

                return res.status(StatusCodes.OK).json({ campaigns });
            } catch (error) {
                log.error(error);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
            }
        }
        case 'POST': {
            try {
                const userId = getUserId(req, res);

                const campaign = await createCampaign(CampaignSchema.parse(req.body), userId);

                return res.status(StatusCodes.OK).json({ campaign });
            } catch (error) {
                log.error(error);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
            }
        }
        default:
            return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: ReasonPhrases.METHOD_NOT_ALLOWED });
    }
};
