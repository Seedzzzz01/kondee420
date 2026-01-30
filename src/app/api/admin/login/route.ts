import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        // Hardcoded credentials based on user request
        if (username === 'Kondee420' && password === 'Kondee420!') {
            const response = NextResponse.json({ success: true });

            // Set session cookie
            // In a real app, this would be a JWT or a session ID in a DB
            // For this request, we'll use a simple authenticated cookie
            response.cookies.set({
                name: 'admin_session',
                value: 'authenticated',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24, // 24 hours
                path: '/',
            });

            return response;
        }

        return NextResponse.json(
            { error: 'Invalid username or password' },
            { status: 401 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE() {
    const response = NextResponse.json({ success: true });
    response.cookies.set({
        name: 'admin_session',
        value: '',
        maxAge: 0,
        path: '/',
    });
    return response;
}
