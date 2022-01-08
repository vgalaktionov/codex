import pg from 'pg';
import { SQL } from 'sql-template-strings';

if ((global as any).pool == null) {
    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL ?? 'postgres://vadim@localhost:5432/codex',
    });

    process.on('beforeExit', async () => {
        try {
            await pool.end();
        } catch (error) {}
    });

    (global as any).pool = pool;
}

export const pool = (global as any).pool as pg.Pool;
export const sql = SQL;
