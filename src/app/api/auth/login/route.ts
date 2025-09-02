import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Temporarily hardcode values for testing
  const auth0Domain = 'dev-g4f5xdg3cgiq5weu.us.auth0.com';
  const clientId = 'zHHgpGWH9Msgd8vezAkNCkepDvRD5JH1';
  const redirectUri = 'https://to-do-list-pink-three-35.vercel.app';
  
  console.log('Auth0 Config:', {
    domain: auth0Domain,
    clientId: clientId,
    redirectUri: redirectUri
  });

  const authUrl = `https://${auth0Domain}/authorize?` +
    `response_type=code&` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `scope=openid profile email&` +
    `state=${Math.random().toString(36).substring(7)}`;

  console.log('Redirecting to:', authUrl);

  return NextResponse.redirect(authUrl);
} 
