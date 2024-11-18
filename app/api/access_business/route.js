import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
    const { accessToken } = await request.json(); 

    if (!accessToken) {
        return NextResponse.json({ error: 'Access token is required' }, { status: 400 });
    }

    try {
        const url = 'https://graph.facebook.com/v17.0/me/businesses';

        const response = await axios.get(url, {
            params: {
                access_token: accessToken,
                fields: 'id,name,account_status,spend_cap',
            },
        });

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Error fetching ad accounts:', error.response ? error.response.data : error.message);
        return NextResponse.json({ error: 'Failed to fetch ad accounts' }, { status: 500 });
    }
}
