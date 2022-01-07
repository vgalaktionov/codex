import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { PUBLIC_ROUTES, SECRET_KEY } from '../lib/auth';

export function middleware(req: NextRequest) {
    let path: string;
    try {
        path = new URL(req.url).pathname;
    } catch (error) {
        path = req.url;
    }
    if (path === '/login') {
        try {
            jwt.verify(req.cookies['token'], SECRET_KEY);
            return NextResponse.redirect('/app/characters/sheet');
        } catch (error) {}
    }
    if (!PUBLIC_ROUTES.includes(path) && !/(jpeg|png|ico|webmanifest)$/.test(path)) {
        try {
            jwt.verify(req.cookies['token'], SECRET_KEY);
        } catch (error) {
            return NextResponse.redirect('/login');
        }
    }
}
