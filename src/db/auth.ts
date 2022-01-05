import { sql } from '@leafac/sqlite';
import { User, UserSchema } from '../lib/auth';
import { HasID } from '../lib/util';
import database from './client';

export function createUser(user: User) {
    const result = database.get<HasID<User>>(
        sql`INSERT INTO users (email, passwordHash) VALUES (${user.email}, ${user.passwordHash}) RETURNING *;`,
    );
    return UserSchema.parse(result);
}

export function getUserByEmail(email: string) {
    const result = database.get<HasID<User>>(sql`SELECT * FROM users WHERE email = ${email};`);
    return UserSchema.parse(result);
}
