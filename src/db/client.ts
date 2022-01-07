import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL ?? 'postgres://vadim@localhost:5432/codex');

export default sql;
