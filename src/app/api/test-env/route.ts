import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_BASE_URL: process.env.AUTH0_BASE_URL,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET ? 'SET' : 'NOT SET',
    AUTH0_SECRET: process.env.AUTH0_SECRET ? 'SET' : 'NOT SET'
  });
} 