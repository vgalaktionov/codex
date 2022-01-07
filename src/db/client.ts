import postgres from 'postgres';

if ((global as any).sql == null) {
    const sql = postgres(process.env.DATABASE_URL ?? 'postgres://vadim@localhost:5432/codex');

    (global as any).sql = sql;
}

export default (global as any).sql as postgres.Sql<{}>;
