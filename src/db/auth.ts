import { User, UserSchema } from '../lib/auth';
import { HasID } from '../lib/util';
import { database, sql } from './client';

export async function createUser(user: User) {
    const db = await database;
    const result = await db.get<HasID<User>>(
        sql`INSERT INTO users (email, passwordHash) VALUES (${user.email}, ${user.passwordHash}) RETURNING *;`,
    );
    return UserSchema.parse(result);
}

export async function getUserByEmail(email: string) {
    const db = await database;
    const result = await db.get<HasID<User>>(sql`SELECT * FROM users WHERE email = ${email};`);
    return UserSchema.parse(result);
}
