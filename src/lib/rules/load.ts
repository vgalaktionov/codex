import { loadDefaultRules } from '.';
import sql from '../../db/client';
import { measurePromise } from '../util';

measurePromise(() => loadDefaultRules(false).then(() => setTimeout(() => sql.end(), 1000)));
