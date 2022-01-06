import SQL from 'sql-template-strings';
import { Database, open } from 'sqlite';
import sqlite3 from 'sqlite3';

export const database: Promise<Database> = open({
    filename: process.env.NODE_ENV === 'test' ? ':memory:' : process.env.DATABASE_PATH ?? 'codex.sqlite',
    driver: sqlite3.cached.Database,
}).then(async (database) => {
    await database.migrate();

    await database.exec(sql`
        PRAGMA foreign_keys = ON;
        PRAGMA synchronous = NORMAL;
        PRAGMA journal_mode = 'WAL';
    `);
    return database;
});
export const sql = SQL;
