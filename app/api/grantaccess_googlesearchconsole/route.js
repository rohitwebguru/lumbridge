import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { accountId, emailToGrant, accessToken } = await request.json();

        const oauth2Client = new google.auth.OAuth2({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
            redirect_uri: 'http://localhost:3000/api/auth/google/callback'
        });
        
        // Set the access token
        oauth2Client.setCredentials({ access_token: accessToken });

        // Initialize Search Console API
        const service = google.webmasters({ version: 'v3', auth: oauth2Client });

        // List all properties
        const propertiesResponse = await service.sites.list();
        const properties = propertiesResponse.data.siteEntry;
        if (!properties) {
            return NextResponse.json(
                { message: `User does not have access to ${accountId}` },
                { status: 403 }
            );
        }

        // Check if the user has access to the property
        if (!properties.some(property => property.siteUrl === accountId)) {
            return NextResponse.json(
                {
                    message: `User does not have access to ${accountId}`
                },
                { status: 403 }
            );
        }


        return new Response(
            JSON.stringify({ message: `Access granted access to ${accountId}`}),
            { status: 200 }
        );

        // const admin = google.admin({ version: 'directory_v1', auth: oauth2Client });

        // const res = await admin.users.list({
        //     customer: 'my_customer', // Use 'my_customer' for all users in a Google Workspace domain
        //     maxResults: 10,
        //     orderBy: 'email'
        // });
       
        // const permissionsResponse = await service.sites.getUser({
        //     siteUrl: accountId,
        // });

        // const permissions = permissionsResponse.data;

    
        // const userPermission = permissions.users.find(user => user.emailAddress === emailToGrant);

        // if (userPermission) {
        //     return NextResponse.json(
        //         { message: `${emailToGrant} has the following permissions:`, userPermission },
        //         { status: 200 }
        //     );
        // } else {
        //     return NextResponse.json(
        //         { message: `${emailToGrant} does not have access to ${accountId}` },
        //         { status: 404 }
        //     );
        // }

        
    } catch (error) {
        console.error('Error checking permissions:', error);
        return NextResponse.json(
            { message: 'Error checking permissions', error: error.message },
            { status: 500 }
        );
    }
}
