import { User, UserSchema } from '../lib/auth';
import { HasID } from '../lib/util';
import { pool, sql } from './client';

export async function createUser(user: User) {
    const result = await pool.query<HasID<User>>(
        sql`INSERT INTO users (email, "passwordHash") VALUES (${user.email}, ${user.passwordHash}) RETURNING *;`,
    );
    return UserSchema.parse(result.rows[0]);
}

export async function getUserByEmail(email: string) {
    const result = await pool.query<HasID<User>>(sql`SELECT * FROM users WHERE email = ${email};`);
    try {
        return UserSchema.parse(result.rows[0]);
    } catch (error) {
        return undefined;
    }
}
