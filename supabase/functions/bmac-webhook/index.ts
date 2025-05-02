import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';

serve(async (req) => {
  // Log the incoming request method and headers for debugging
  console.log(`Received ${req.method} request`);
  console.log('Request Headers:', req.headers);

  // Check if the method is POST
  if (req.method !== 'POST') {
    console.log('Method not allowed: ', req.method);
    return new Response('Method Not Allowed', { status: 405 });
  }

  // Parse the body of the request
  let body;
  try {
    body = await req.json();
    console.log('Request Body:', body); // Log the parsed body
  } catch (err) {
    console.log('Error parsing JSON:', err);
    return new Response('Invalid JSON', { status: 400 });
  }

  // Prepare the data to be sent to Supabase
  const supporter = {
    name: body.supporter_name,
    message: body.support_message,
    email: body.supporter_email,
    amount: body.amount
  };

  // Log the data that will be sent to Supabase
  console.log('Storing supporter:', supporter);

  // Make the request to Supabase to store the supporter data
  const response = await fetch(
    `${Deno.env.get('SUPABASE_URL')}/rest/v1/supporters`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': Deno.env.get('REACT_APP_SUPABASE_ANON_KEY')!,
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!}`
      },
      body: JSON.stringify(supporter)
    }
  );

  // Check for errors in the Supabase response
  if (!response.ok) {
    const errorText = await response.text();
    console.log('Error storing supporter in Supabase:', errorText);
    return new Response(`Error storing supporter: ${errorText}`, {
      status: 500
    });
  }

  // If everything is successful, log success and return the response
  console.log('Supporter successfully stored in Supabase');
  return new Response('Supporter stored!', { status: 200 });
});
