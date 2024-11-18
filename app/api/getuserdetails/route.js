import { NextResponse } from "next/server";
import clientPromise from '../../lib/mongodb';

export async function POST(req) {
    try {
        const name = await req.text();
        if (!name) {
            return NextResponse.json({ success: false, message: 'username is required' }, { status: 400 });
        }
        const client = await clientPromise;
        const db = client.db("lumbridge_db");

        const user = await db.collection("users").findOne({ name: name });
       
        if (!user) {
            return NextResponse.json({ success: false, message: `User not found, ${name}` }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: { name: user.name, email: user.email, provider:user.provider } });

    } catch (err) {
        return NextResponse.json({ success: false, message: `Internal server error, ${err}` }, { status: 500 });
    }
}