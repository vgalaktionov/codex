import { loadDefaultRules } from '.';
import sql from '../../db/client';
import { measurePromise } from '../util';

measurePromise(() => loadDefaultRules(true).then(() => setTimeout(() => sql.end(), 1000)));
