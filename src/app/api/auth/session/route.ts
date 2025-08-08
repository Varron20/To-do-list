import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('auth0_session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'No session' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    
    // Check if tokens are still valid (simplified check)
    if (!session.user || !session.tokens) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    return NextResponse.json({ user: session.user });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ error: 'Session check failed' }, { status: 500 });
  }
} 