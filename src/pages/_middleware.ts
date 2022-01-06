import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { PUBLIC_ROUTES, SECRET_KEY } from '../lib/auth';

export function middleware(req: NextRequest) {
    if (!PUBLIC_ROUTES.includes(new URL(req.url).pathname)) {
        try {
            jwt.verify(req.cookies['token'], SECRET_KEY);
        } catch (error) {
            return NextResponse.redirect('/login');
        }
    }
}
