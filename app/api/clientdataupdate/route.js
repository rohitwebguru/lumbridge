// import { NextResponse } from "next/server";
// import clientPromise from '../../lib/mongodb';

// export async function POST(req) {
//     try {
//         const { currentuseremail, clientData, access } = await req.json();

//         if (!currentuseremail || !clientData) {
//             return NextResponse.json({
//                 success: false,
//                 message: 'Missing required fields: email or clientData'
//             }, { status: 400 });
//         }

//         const client = await clientPromise;
//         const db = client.db("lumbridge_db");

//         const user = await db.collection("users").findOne({ email: currentuseremail });

//         if (!user) {
//             return NextResponse.json({
//                 success: false,
//                 message: 'User not found.'
//             }, { status: 404 });
//         }

//         await db.collection("users").updateOne(
//             { email: currentuseremail, 'links.slug': access },
//             {
//                 $addToSet: {
//                     'links.$.clients': clientData 
//                 }
//             }
//         );

//         return NextResponse.json({
//             success: true,
//             message: 'Client data successfully updated.',
//         });

//     } catch (err) {
//         return NextResponse.json({
//             success: false,
//             message: `Internal server error: ${err.message}`
//         }, { status: 500 });
//     }
// }

import { NextResponse } from "next/server";
import clientPromise from '../../lib/mongodb';

export async function POST(req) {
    try {
        const { currentuseremail, clientData, access } = await req.json();

        if (!currentuseremail || !clientData) {
            return NextResponse.json({
                success: false,
                message: 'Missing required fields: email or clientData'
            }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("lumbridge_db");

        const user = await db.collection("users").findOne({ email: currentuseremail });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'User not found.'
            }, { status: 404 });
        }

        // Check if the client already exists in the user's clients array
        const existingClient = user.links.find(link => link.slug === access)?.clients.find(client => client.email === clientData.email);

        if (existingClient) {
            // Update the existing client entry
            await db.collection("users").updateOne(
                { email: currentuseremail, 'links.slug': access, 'links.clients.email': clientData.email },
                {
                    $set: {
                        'links.$.clients.$[client]': clientData
                    }
                },
                {
                    arrayFilters: [{ 'client.email': clientData.email }] // Update the specific client by email
                }
            );

            return NextResponse.json({
                success: true,
                message: 'Client data successfully updated.',
            });
        } else {
            // Add the new client entry if it does not exist
            await db.collection("users").updateOne(
                { email: currentuseremail, 'links.slug': access },
                {
                    $addToSet: {
                        'links.$.clients': clientData 
                    }
                }
            );

            return NextResponse.json({
                success: true,
                message: 'New client data successfully added.',
            });
        }

    } catch (err) {
        return NextResponse.json({
            success: false,
            message: `Internal server error: ${err.message}`
        }, { status: 500 });
    }
}
