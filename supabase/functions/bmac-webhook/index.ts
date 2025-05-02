import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';

serve(async (req) => {
  // No need to import `Request` here
  const body = await req.json();
  console.log('Received body:', body);

  const supporter = {
    name: body.supporter_name,
    message: body.support_message,
    email: body.supporter_email,
    amount: body.support_amount
  };

  const response = await fetch(
    `${Deno.env.get('SUPABASE_URL')}/rest/v1/supporters`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': Deno.env.get('SUPABASE_ANON_KEY')!,
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!}`
      },
      body: JSON.stringify(supporter)
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    return new Response(`Error storing supporter: ${errorText}`, {
      status: 500
    });
  }

  return new Response('Supporter stored!', { status: 200 });
});
