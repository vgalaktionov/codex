import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getActiveCampaign } from '../../../db/campaigns';
import { createCharacter, getCharacters } from '../../../db/characters';
import { getUserId } from '../../../lib/auth';
import { CharacterSchema } from '../../../lib/characters';
import { log, serializeDates } from '../../../lib/util';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'GET': {
            try {
                const userId = getUserId(req, res);

                const characters = (await getCharacters(userId)).map(serializeDates);

                return res.status(StatusCodes.OK).json({ characters });
            } catch (error) {
                log.error(error);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
            }
        }
        case 'POST': {
            try {
                const userId = getUserId(req, res);

                const campaignId = (await getActiveCampaign(userId))?.id;
                if (campaignId == null)
                    return res.status(StatusCodes.NOT_FOUND).json({ error: 'No active campaign found.' });

                const character = await createCharacter(CharacterSchema.parse(req.body), userId, campaignId);

                return res.status(StatusCodes.OK).json({ character });
            } catch (error) {
                log.error(error);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
            }
        }
        default:
            return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: ReasonPhrases.METHOD_NOT_ALLOWED });
    }
};
