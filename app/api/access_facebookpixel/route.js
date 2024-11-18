import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
    const { accessToken } = await request.json();

    if (!accessToken) {
        return NextResponse.json({ error: 'Access token is required' }, { status: 400 });
    }

    try {
        const pagesUrl = 'https://graph.facebook.com/v17.0/me/businesses';

        const pagesResponse = await axios.get(pagesUrl, {
            params: {
                access_token: accessToken,
                fields: 'id,name,account_status,spend_cap',
            },
        });


        const pages = pagesResponse.data.data;
        const pixel = [];
        for (const page of pages) {
            const pixelUrl = `https://graph.facebook.com/v20.0/${page.id}/adspixels`;
            const pixelResponse = await axios.get(pixelUrl, {
                params: {
                    fields:'name',
                    access_token: accessToken,
                },
            });
            if (pixelResponse.data.data && pixelResponse.data.data.length > 0) {
                pixel.push(...pixelResponse.data.data); 
            }
        }

        return NextResponse.json({ pixel });
    } catch (error) {
        console.error('Error fetching data:', error.response ? error.response.data : error.message);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
