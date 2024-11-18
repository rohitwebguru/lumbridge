import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const [email, access] = state ? state.split('-') : [];

    if (!code) {
        return NextResponse.json({ error: 'Authorization code missing' }, { status: 400 });
    }

    try {
        const tokenResponse = await axios.get('https://graph.facebook.com/v11.0/oauth/access_token', {
            params: {
                client_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
                client_secret: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_SECRET,
                redirect_uri: 'http://localhost:3000/api/auth/facebook/callback',
                code,
            },
        });

        const accessToken = tokenResponse.data.access_token;
        if (!accessToken) {
            throw new Error('No access token received');
        }

        const userInfoResponse = await axios.get('https://graph.facebook.com/me', {
            params: {
                access_token: accessToken,
                fields: 'id,name,email',
            },
        });

        const user = userInfoResponse.data;

        const clientData = {
            name: user.name,
            email: user.email,
            access_token: accessToken,
            state: state
        };
        console.log(clientData)
        const htmlResponse = `
          <html>
            <body>
               <script>
                const clientData = ${JSON.stringify(clientData)};
                window.opener.postMessage({ success: true, clientData: clientData }, '*');
                window.close();
              </script>
            </body>
          </html>
        `;

        return new Response(htmlResponse, {
            headers: { 'Content-Type': 'text/html' },
        });
    } catch (error) {
        console.error('Facebook OAuth Error:', error.response ? error.response.data : error.message);
        return NextResponse.json({ error: `Failed to authenticate with Facebook: ${error.message}` }, { status: 500 });
    }
}
