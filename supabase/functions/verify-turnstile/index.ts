import { serve } from 'https://deno.land/std/http/server.ts';

serve(async (req) => {
  const { token } = await req.json();

  const secretKey = Deno.env.get('REACT_TURNSTILE_SECRET');
  const response = await fetch(
    'https://rebkmllpazozwtqljvea.supabase.co/functions/v1/verify-turnstile',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: secretKey!,
        response: token
      })
    }
  );

  const data = await response.json();

  if (data.success) {
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } else {
    return new Response(
      JSON.stringify({ success: false, errors: data['error-codes'] }),
      { status: 400 }
    );
  }
});
