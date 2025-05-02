import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';
import 'https://deno.land/x/dotenv/load.ts';

serve(async (req) => {
  console.log(`Received ${req.method} request`);
  console.log('Request Headers:', req.headers);

  // Only allow POST
  if (req.method !== 'POST') {
    console.log('Method not allowed: ', req.method);
    return new Response('Method Not Allowed', { status: 405 });
  }

  // Get raw text body
  const rawBody = await req.text();
  console.log('Raw Body:', rawBody);

  // Parse JSON
  let body;
  try {
    body = JSON.parse(rawBody);
    console.log('Parsed Body:', body);
  } catch (err) {
    console.log('Error parsing JSON:', err);
    return new Response('Invalid JSON', { status: 400 });
  }

  // Check if the expected fields are present
  if (
    !body ||
    !body.data ||
    !body.data.supporter_name ||
    !body.data.message ||
    !body.data.supporter_email ||
    !body.data.amount
  ) {
    console.log('Missing required fields in the incoming data:', body);
    return new Response('Missing required fields', { status: 400 });
  }

  // Initialize Supabase client using environment variables
  const supabaseUrl = Deno.env.get('REACT_APP_SUPABASE_URL');
  const supabaseKey = Deno.env.get('REACT_SERVICE_ROLE_KEY');

  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase Key:', supabaseKey ? '****' : 'Not provided');

  if (!supabaseUrl || !supabaseKey) {
    console.log('Supabase URL or Key is missing in environment variables.');
    return new Response('Internal Server Error', { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Prepare the supporter data
  const supporter = {
    name: body.data.supporter_name,
    message: body.data.message,
    email: body.data.supporter_email,
    amount: body.data.amount
  };

  console.log('Storing supporter in Supabase:', supporter);

  // Make the request to Supabase to store the supporter data
  const { data, error } = await supabase.from('supporters').insert([supporter]);

  // Handle error in inserting data
  if (error) {
    console.log('Error storing supporter in Supabase:', error.message);
    return new Response(`Error storing supporter: ${error.message}`, {
      status: 500
    });
  }

  console.log('Supporter successfully stored in Supabase:', data);
  return new Response('Supporter stored!', { status: 200 });
});
