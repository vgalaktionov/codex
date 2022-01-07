import postgres from 'postgres';
import shift from 'postgres-shift';
import { log } from '../lib/util';

const sql = postgres(process.env.DATABASE_URL ?? 'postgres://vadim@localhost:5432/codex');

shift({ sql }).catch(log.error);

export default sql;
