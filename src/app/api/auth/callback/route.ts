import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(error)}`, request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', request.url));
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch(`https://dev-g4f5xdg3cgiq5weu.us.auth0.com/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          client_id: 'zHHgpGWH9Msgd8vezAkNCkepDvRD5JH1',
          client_secret: '_siw_p4K5h9wqzL1Ka-OZabVrcYJW8eArG5pspQ7kQADlKeXIJOxuPVTykpZwU6A',
          code,
          redirect_uri: 'https://to-do-list-pink-three-35.vercel.app/api/auth/callback',
      }),
    });

    const tokens = await tokenResponse.json();

    if (tokens.error) {
      return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(tokens.error_description || tokens.error)}`, request.url));
    }

    // Get user info
    const userResponse = await fetch(`https://dev-g4f5xdg3cgiq5weu.us.auth0.com/userinfo`, {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
      },
    });

    const user = await userResponse.json();

    // Set session cookie
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set('auth0_session', JSON.stringify({ user, tokens }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(new URL('/?error=callback_failed', request.url));
  }
} 
