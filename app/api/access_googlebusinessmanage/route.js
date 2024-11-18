// app/api/getBusinesses/route.js
import { google } from 'googleapis';

export async function POST(request) {
    const { accessToken } = await request.json();

    if (!accessToken) {
        return new Response(
            JSON.stringify({ message: 'Invalid request body' }),
            { status: 400 }
        );
    }

    const oauth2Client = new google.auth.OAuth2(
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
        'http://localhost:3000/api/auth/google/callback'
    );

    oauth2Client.setCredentials({ access_token: accessToken });
    
    console.log(google.mybusinessaccountmanagement('v1').accounts)
    const business = google.mybusinessaccountmanagement({
        version: 'v1',
        auth: oauth2Client,
    });
    try {
        const response = await business.accounts.list();
        const accounts = response.data.accounts;

        return new Response(JSON.stringify(accounts), { status: 200 });
    } catch (error) {
        console.error('Error fetching businesses:', error);
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}
