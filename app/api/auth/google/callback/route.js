import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const [email, access] = state.split('-');  // Split by the hyphen

    if (!code) {
        return NextResponse.json({ error: 'Authorization code missing' }, { status: 400 });
    }

    try {
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            code,
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
            redirect_uri: 'http://localhost:3000/api/auth/google/callback',
            grant_type: 'authorization_code'
        });

        const { access_token, refresh_token } = tokenResponse.data;

        const userInfoResponse = await axios.get(
            `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
        );

        const user = userInfoResponse.data;

        const clientData = {
            name: user.name,
            email: user.email,
            access_token: access_token,
            refresh_token: refresh_token,
            state: state
        };
        // const currentuseremail = email;
        // if (!currentuseremail) {
        //     return NextResponse.json({
        //         success: false,
        //         message: 'Email is required.',
        //     }, { status: 400 });
        // }

        // try {
        //     const scopeUpdateResponse = await axios.post(
        //         'http://localhost:3000/api/clientdataupdate',
        //         { clientData, currentuseremail, access }
        //     );

        //     if (scopeUpdateResponse.data.success) {
        //         return NextResponse.json({
        //             success: true,
        //             message: clientData,
        //         });
        //     } else {
        //         console.error('Failed to store data:', scopeUpdateResponse.data);
        //         return NextResponse.json({
        //             success: false,
        //             message: 'Data could not be stored',
        //         }, { status: 500 });
        //     }
        // } catch (error) {
        //     console.error('Error while updating client data:', error);
        //     return NextResponse.json({
        //         success: false,
        //         message: `An error occurred while storing data. ${error.message}`,
        //     }, { status: 500 });
        // }
        // return NextResponse.json({
        //           success: true,
        //           message: [tokenResponse.data,userInfoResponse.data ],
        //       });
     
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
        console.error('Google OAuth Error:', error);
        return NextResponse.json({ error: 'Failed to authenticate with Google' }, { status: 500 });
    }
}
