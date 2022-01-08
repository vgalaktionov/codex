import { loadDefaultRules } from '.';
import { pool } from '../../db/client';
import { measurePromise } from '../util';

measurePromise(() => loadDefaultRules(false).then(() => pool.end()));
