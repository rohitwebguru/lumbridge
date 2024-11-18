import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
    const { accessToken } = await request.json(); 

    if (!accessToken) {
        return NextResponse.json({ error: 'Access token is required' }, { status: 400 });
    }

    try {
        const pagesUrl = 'https://graph.facebook.com/v17.0/me/accounts';
        const pagesResponse = await axios.get(pagesUrl, {
            params: {
                access_token: accessToken,
                fields: 'id,name,account_status,spend_cap,access_token,instagram_business_account',
            },
        });

        const pages = pagesResponse.data.data;
        const instagramAccounts = [];
        for (const page of pages) {
            if (page.instagram_business_account) {
                const instagramUrl = `https://graph.facebook.com/v20.0/me/instagram_accounts`;

                const instagramResponse = await axios.get(instagramUrl, {
                    params: {
                        fields: 'username',
                        access_token: page.access_token,
                    },
                });

                instagramAccounts.push(
                 ...instagramResponse.data.data
                );
            }
        }

        return NextResponse.json({ instagramAccounts });
    } catch (error) {
        console.error('Error fetching data:', error.response ? error.response.data : error.message);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
