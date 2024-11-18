import { NextResponse } from "next/server";
import clientPromise from '../../lib/mongodb';


export async function POST(req) {
    try {
        const body = await req.json();
        console.log('Body:', body);
        const { slug, username } = body;

        if (!slug || !username) {
            return NextResponse.json({ success: false, message: `hjhjh ${slug}, ${username}` })
        }
        const client = await clientPromise;
        const db = client.db('lumbridge_db');

        const checkslug = await db.collection("users").findOne({
            'links.slug': slug,
            'name': username 
        });

        if (!checkslug) {
            return NextResponse.json({ success: false, message: 'slug not found' })
        }
        const link = checkslug.links.find(link => link.slug === slug);
        const scopes = link.scopes;

        return NextResponse.json({
            success: true,
            message: 'Slug found.',
            data: {
                scopes: scopes
            }
        });

    } catch (err) {
        return NextResponse.json({
            success: false,
            message: `Internal server error: ${err.message}`
        }, { status: 500 });
    }
}