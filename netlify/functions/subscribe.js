export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const { email } = await req.json();

  if (!email) {
    return new Response(JSON.stringify({ error: 'E-post mangler' }), { status: 400 });
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': Netlify.env.get('BREVO_API_KEY'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        listIds: [3],
        updateEnabled: true,
      }),
    });

    if (response.ok || response.status === 204) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    const data = await response.json();
    if (data.code === 'duplicate_parameter') {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: 'Noe gikk galt' }), { status: 500 });
  } catch {
    return new Response(JSON.stringify({ error: 'Noe gikk galt' }), { status: 500 });
  }
};

export const config = { path: '/api/subscribe' };
