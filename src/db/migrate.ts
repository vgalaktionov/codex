import { migrate } from 'postgres-migrations';
import { pool } from './client';

async function runMigrations() {
    await migrate({ client: pool }, 'migrations');
    await pool.end();
}

runMigrations();
