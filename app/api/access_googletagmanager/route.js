import { google } from 'googleapis';

export async function POST(request) {
    const { accessToken, emailToGrant, containerId, accountId } = await request.json();

    const oauth2Client = new google.auth.OAuth2({
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
        redirectUri: 'http://localhost:3000/api/auth/google/callback',
    });

    oauth2Client.setCredentials({ access_token: accessToken });

    const tagmanager = google.tagmanager({ version: 'v2', auth: oauth2Client });

    try {
        // Step 1: List the user's containers
        // const accounts = await tagmanager.accounts.list();
        // const accountId = accounts.data.account[0].accountId;

        // const containers = await tagmanager.accounts.containers.list({
        //     parent: `accounts/${accountId}`,
        // });

        // const containerId = containers.data.container[0].containerId;

        // Step 2: Grant access to the selected container
        const permissions = {
        
                accountAccess: {
                    permission: "admin",
                },
                containerAccess: [{
                    containerId: containerId,
                    permission: "read",
                }]
            ,
            emailAddress: emailToGrant
        };

        const response = await tagmanager.accounts.user_permissions.create({
            parent: `accounts/${accountId}`,
            requestBody: permissions,
        });

        return new Response(JSON.stringify({ message: `Access granted to ${emailToGrant}` }), { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ message: 'Error occurred', error: error.message }), { status: 500 });
    }
}
