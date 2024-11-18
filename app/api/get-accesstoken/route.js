import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";

export async function POST(req) {
    try {
        const { username, slug } = await req.json();

        if (!username || !slug) {
            return NextResponse.json({ success: false, message: 'Username and slug are required.' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("lumbridge_db");

        const user = await db.collection("users").findOne({
            name: username,
            "links.slug": slug
        });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "No user found with the given username and slug."
            }, { status: 404 });
        }

        const link = user.links.find(link => link.slug === slug);

        if (!link) {
            return NextResponse.json({
                success: false,
                message: "No matching link found for the given slug."
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Link found.",
            data: {
                clients: link.clients 
            }
        });

    } catch (err) {
        return NextResponse.json({
            success: false,
            message: `Internal server error: ${err.message}`
        }, { status: 500 });
    }
}
