// app/api/verify-turnstile/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { token } = await request.json();

  if (!token) {
    return NextResponse.json(
      { success: false, error: 'Missing turnstile token' },
      { status: 400 }
    );
  }

  const secret = process.env.NEXT_PUBLIC_TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error('Turnstile: missing secret key');
    return NextResponse.json(
      { success: false, error: 'Server misconfigured' },
      { status: 500 }
    );
  }

  try {
    const cfRes = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ secret, response: token })
      }
    );
    const json = await cfRes.json();

    if (!cfRes.ok || !json.success) {
      console.error('Turnstile verify failed:', json);
      return NextResponse.json(
        { success: false, error: 'CAPTCHA verification failed' },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('Turnstile verify error:', err);
    return NextResponse.json(
      { success: false, error: 'Verification service unavailable' },
      { status: 503 }
    );
  }
}
