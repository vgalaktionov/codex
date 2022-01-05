import { Database, sql } from '@leafac/sqlite';

const database = new Database(process.env.DATABASE_PATH ?? 'codex.sqlite');

database.migrate(sql`
    CREATE TABLE users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        passwordHash TEXT NOT NULL,
        ownsContent TEXT
    );
`);

database.execute(sql`
	PRAGMA foreign_keys = ON;
	PRAGMA synchronous = NORMAL;
	PRAGMA journal_mode = 'WAL';
`);

export default database;
