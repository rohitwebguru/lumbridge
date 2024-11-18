import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(request) {
    const {accessToken} = await request.json();

    if ( !accessToken) {
        return NextResponse.json(
            { message: 'Invalid request body' },
            { status: 400 }
        );
    }
 
    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
        {
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
            redirect_uri: 'http://localhost:3000/api/auth/google/callback'
        }
    );

    // Set the access token
    oauth2Client.setCredentials({ access_token: accessToken });

    // Initialize Google Analytics API
    const analytics = google.analytics({ version: 'v3', auth: oauth2Client });

    try {
        // List accounts for the authenticated user
        const response = await analytics.management.accounts.list();
        const accounts = response.data.items;

        // Return the accounts list using NextResponse
        return NextResponse.json(
            { accounts },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching accounts:', error);
        return NextResponse.json(
            { message: 'Error fetching accounts', error: error.message },
            { status: 500 }
        );
    }
}
