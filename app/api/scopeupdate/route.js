import { NextResponse } from "next/server";
import clientPromise from '../../lib/mongodb';

export async function POST(req) {
    try {
        const { googleScopes, facebookScopes, link, email } = await req.json();

        if (!googleScopes || !facebookScopes || !link || !email ) {
            return NextResponse.json({
                success: false,
                message: 'Missing required fields: googleScopes, facebookScopes, link, clientData or email'
            }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("lumbridge_db");

        const newSlug = {
            slug: link,
            scopes: {
                google: googleScopes,    
                facebook: facebookScopes   
            },
            createdAt: new Date(),
            clients: null
        };

        const user = await db.collection("users").findOne({ email: email });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'User not found.'
            }, { status: 404 });
        }

        if (Array.isArray(user.links) && user.links.length > 0) {
            const existingLinkIndex = user.links.findIndex(l => l.slug === link);

            if (existingLinkIndex !== -1) {
                await db.collection("users").updateOne(
                    { email: email, "links.slug": link },
                    {
                        $set: { 
                            [`links.${existingLinkIndex}.scopes`]: {
                                google: googleScopes,  
                                facebook: facebookScopes   
                            },
                            [`links.${existingLinkIndex}.createdAt`]: new Date() 
                        }
                    }
                );
            } else {
                await db.collection("users").updateOne(
                    { email: email },
                    {
                        $push: {
                            links: newSlug
                        }
                    }
                );
            }
        } else {
            await db.collection("users").updateOne(
                { email: email },
                {
                    $set: {
                        links: [newSlug]
                    }
                }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Link successfully processed.',
            data: newSlug
        });

    } catch (err) {
        return NextResponse.json({
            success: false,
            message: `Internal server error: ${err.message}`
        }, { status: 500 });
    }
}

