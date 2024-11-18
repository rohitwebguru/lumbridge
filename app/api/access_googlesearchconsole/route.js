import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { accessToken } = await request.json();

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
        

        return new Response(
            JSON.stringify({ 
                data: properties }),
            { status: 200 }
        );


        // Get user permissions for the specific property
        // const permissionsResponse = await service.sites.getUser({
        //     siteUrl: siteUrl,
        // });

        // const permissions = permissionsResponse.data;

        // Check if the specified email has access
        // const userPermission = permissions.users.find(user => user.emailAddress === emailToCheck);

        // if (userPermission) {
        //     return NextResponse.json(
        //         { message: `${emailToCheck} has the following permissions:`, userPermission },
        //         { status: 200 }
        //     );
        // } else {
        //     return NextResponse.json(
        //         { message: `${emailToCheck} does not have access to ${siteUrl}` },
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
