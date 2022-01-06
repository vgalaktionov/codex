import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { PUBLIC_ROUTES, SECRET_KEY } from '../lib/auth';

export function middleware(req: NextRequest) {
    if (!PUBLIC_ROUTES.includes(req.url.split('/')[1])) {
        try {
            jwt.verify(req.cookies['token'], SECRET_KEY);
        } catch (error) {
            return NextResponse.redirect('/login');
        }
    }
}
