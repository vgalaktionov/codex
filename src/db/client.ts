import postgres from 'postgres';
import shift from 'postgres-shift';

const sql = postgres(process.env.DATABASE_URL ?? 'postgres://vadim@localhost:5432/codex');

shift({ sql });

export default sql;
