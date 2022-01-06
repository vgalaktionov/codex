import { User, UserSchema } from '../lib/auth';
import { HasID } from '../lib/util';
import sql from './client';

export async function createUser(user: User) {
    const [result] = await sql<
        HasID<User>[]
    >`INSERT INTO users (email, "passwordHash") VALUES (${user.email}, ${user.passwordHash}) RETURNING *;`;
    return UserSchema.parse(result);
}

export async function getUserByEmail(email: string) {
    const [result] = await sql<HasID<User>[]>`SELECT * FROM users WHERE email = ${email};`;
    try {
        return UserSchema.parse(result);
    } catch (error) {
        return undefined;
    }
}
