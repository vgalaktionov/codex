import { loadDefaultRules } from '.';
import { measurePromise } from '../util';

measurePromise(loadDefaultRules, undefined, true);
