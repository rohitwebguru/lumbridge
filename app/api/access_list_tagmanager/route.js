// api/list_google_containers.js
import { google } from 'googleapis';

export async function POST(request) {
    const { accessToken } = await request.json();

    const oauth2Client = new google.auth.OAuth2({
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
        redirectUri: 'http://localhost:3000/api/auth/google/callback',
    });

    oauth2Client.setCredentials({ access_token: accessToken });

    const tagmanager = google.tagmanager({ version: 'v2', auth: oauth2Client });

    try {
        const accounts = await tagmanager.accounts.list();
        const accountId = accounts.data.account[0].accountId;

        const containers = await tagmanager.accounts.containers.list({
            parent: `accounts/${accountId}`,
        });

        return new Response(JSON.stringify( containers.data ), { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ message: 'Error occurred while listing containers', error: error.message }), { status: 500 });
    }
}
