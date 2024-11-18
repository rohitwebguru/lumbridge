// app/api/stripe/route.js
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET() {
  try {
    const plans = await stripe.prices.list({
      expand: ['data.product'], 
    });

    return NextResponse.json({ plans: plans.data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
