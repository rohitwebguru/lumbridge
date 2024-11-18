import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
    const { userAccessToken, pageId, userId, role } = await request.json();

    if (!userAccessToken || !pageId || !userId || !role) {
        return NextResponse.json({ error: 'Required parameters are missing' }, { status: 400 });
    }

    try {
        const pagesUrl = 'https://graph.facebook.com/v17.0/me/accounts';
        const pagesResponse = await axios.get(pagesUrl, {
            params: {
                access_token: userAccessToken,
            },
        });

        const pages = pagesResponse.data.data;
        const page = pages.find(p => p.id === pageId);
        if (!page || !page.access_token) {
            return NextResponse.json({ error: 'Failed to retrieve page access token' }, { status: 400 });
        }
console.log(pageId)
console.log(`https://graph.facebook.com/v21.0/${pageId}/roles`)
        const roleUrl = `https://graph.facebook.com/v21.0/${pageId}/roles`;
        const roleResponse = await axios.get(roleUrl, null,{
            params: {
                user: userId,
                role: role,
                access_token: page.access_token,
            },
        });
        console.log(roleResponse)
        return NextResponse.json({ success: 'Role assigned successfully', data: roleResponse.data });
    } catch (error) {
        console.error('Error assigning role:', error.response ? error.response.data : error.message);
        return NextResponse.json({ error: 'Failed to assign role' }, { status: 500 });
    }
}
