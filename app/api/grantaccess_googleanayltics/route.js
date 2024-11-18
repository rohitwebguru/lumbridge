
import { google } from 'googleapis';
export async function POST(request) {

    const { accessToken, emailToGrant, accountId } = await request.json();
    if (!accessToken || !emailToGrant || !accountId) {
        return new Response(
            JSON.stringify({ message: 'Invalid request body' }),
            { status: 400 }
        );
    }


    const oauth2Client = new google.auth.OAuth2(
        {
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
            redirect_uri: 'http://localhost:3000/api/auth/google/callback'
        }
    );

    oauth2Client.setCredentials({ access_token: accessToken });

    const analytics = google.analytics({ version: 'v3', auth: oauth2Client });

    try {
        const userLink = {
            permissions: {
                local: [
                    "COLLABORATE",
                    "EDIT",
                    "MANAGE_USERS",
                    "READ_AND_ANALYZE"
                ],
            },
            'userRef': {
                'email': emailToGrant
            },
            emailAddress: emailToGrant,
        };

        // Make the API call to create a user link
        await analytics.management.accountUserLinks.insert({
            accountId,
            requestBody: userLink,
        });

        return new Response(
            JSON.stringify({ message: `Access granted to ${emailToGrant}` }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error granting access:', error);
        return new Response(
            JSON.stringify({ message: 'Error granting access', error: error.message }),
            { status: 500 }
        );
    }
}
