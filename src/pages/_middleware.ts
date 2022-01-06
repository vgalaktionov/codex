import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { PUBLIC_ROUTES, SECRET_KEY } from '../lib/auth';

export function middleware(req: NextRequest) {
    const path = new URL(req.url).pathname;
    if (!PUBLIC_ROUTES.includes(path) && !/(jpeg|png|ico|webmanifest)$/.test(path)) {
        try {
            jwt.verify(req.cookies['token'], SECRET_KEY);
        } catch (error) {
            return NextResponse.redirect('/login');
        }
    }
}
