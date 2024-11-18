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
        const catalog = [];
        for (const page of pages) {
            const catalogUrl = `https://graph.facebook.com/v20.0/${page.id}/owned_product_catalogs`;
            const catalogResponse = await axios.get(catalogUrl, {
                params: {
                    access_token: accessToken,
                },
            });
            if (catalogResponse.data.data && catalogResponse.data.data.length > 0) {
                catalog.push(...catalogResponse.data.data); 
            }
        }

        return NextResponse.json({ catalog });
    } catch (error) {
        console.error('Error fetching data:', error.response ? error.response.data : error.message);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
