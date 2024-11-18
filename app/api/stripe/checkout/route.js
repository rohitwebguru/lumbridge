import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    try {
        const { priceId } = await req.json(); 
        console.log("Received priceId:", priceId); 

        // Determine the plan type based on priceId
        const isLifetimePlan = priceId === 'price_1Q6ALsIHrs74fKfjTwXM3Awj'; // Replace with your actual lifetime plan ID

        // Create a Stripe checkout session with the appropriate mode
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription', // Set mode based on plan type
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
        });

        console.log("Created session:", session); // Log the session details

        return new Response(JSON.stringify({url:session.url}), { status: 200 });
    } catch (error) {
        console.error("Error creating session:", error); // Log the error
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

