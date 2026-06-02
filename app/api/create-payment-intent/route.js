import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { amount, customerEmail } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ message: "Montant invalide" }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // en centimes
      currency: "eur",
      receipt_email: customerEmail,
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("❌ PaymentIntent error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
