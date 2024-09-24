import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '../../../firebaseConfig';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20', // 更新到最新版本
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    const customerId = session.client_reference_id;
    const subscriptionId = session.subscription as string;

    if (!customerId) {
      console.error('No customer ID found in session');
      return NextResponse.json({ error: 'No customer ID found' }, { status: 400 });
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const priceId = subscription.items.data[0].price.id;

    let subscriptionType;
    if (priceId === 'price_pro') {
      subscriptionType = 'pro';
    } else if (priceId === 'price_promax') {
      subscriptionType = 'promax';
    } else {
      console.error('Invalid price ID:', priceId);
      return NextResponse.json({ error: 'Invalid subscription type' }, { status: 400 });
    }

    const userRef = doc(db, 'users', customerId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      await updateDoc(userRef, {
        accountLevel: subscriptionType,
        subscriptionId: subscriptionId,
        subscriptionStatus: 'active',
      });
    } else {
      await setDoc(userRef, {
        accountLevel: subscriptionType,
        subscriptionId: subscriptionId,
        subscriptionStatus: 'active',
        points: 5000,
        pointsExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
  }

  return NextResponse.json({ received: true });
}