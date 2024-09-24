import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '../../../firebaseConfig';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
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

    let subscriptionType, wordsLimit;
    if (priceId === 'price_pro') {
      subscriptionType = 'pro';
      wordsLimit = 50000;
    } else if (priceId === 'price_promax') {
      subscriptionType = 'promax';
      wordsLimit = 250000;
    } else {
      console.error('Invalid price ID:', priceId);
      return NextResponse.json({ error: 'Invalid subscription type' }, { status: 400 });
    }

    const userRef = doc(db, 'users', customerId);
    const userDoc = await getDoc(userRef);

    const now = new Date();
    const expiryDate = new Date(now.setDate(now.getDate() + 30));

    if (userDoc.exists()) {
      await updateDoc(userRef, {
        accountLevel: subscriptionType,
        subscriptionId: subscriptionId,
        subscriptionStatus: 'active',
        wordsLimit: wordsLimit,
        wordsUsed: 0,
        planExpiryDate: expiryDate.toISOString(),
      });
    } else {
      await setDoc(userRef, {
        accountLevel: subscriptionType,
        subscriptionId: subscriptionId,
        subscriptionStatus: 'active',
        wordsLimit: wordsLimit,
        wordsUsed: 0,
        planExpiryDate: expiryDate.toISOString(),
      });
    }
  } else if (event.type === 'invoice.paid') {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId = invoice.subscription as string;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const customerId = subscription.customer as string;

    // 获取价格 ID 和对应的订阅类型
    const priceId = subscription.items.data[0].price.id;
    let subscriptionType, wordsLimit;
    if (priceId === 'price_pro') {
      subscriptionType = 'pro';
      wordsLimit = 50000;
    } else if (priceId === 'price_promax') {
      subscriptionType = 'promax';
      wordsLimit = 250000;
    } else {
      console.error('Invalid price ID:', priceId);
      return NextResponse.json({ error: 'Invalid subscription type' }, { status: 400 });
    }

    // 更新用户文档
    const userRef = doc(db, 'users', customerId);
    const now = new Date();
    const expiryDate = new Date(now.setDate(now.getDate() + 30));

    await updateDoc(userRef, {
      accountLevel: subscriptionType,
      subscriptionStatus: 'active',
      wordsLimit: wordsLimit,
      wordsUsed: 0, // 重置使用量
      planExpiryDate: expiryDate.toISOString(),
    });
  } else if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

    const userRef = doc(db, 'users', customerId);
    await updateDoc(userRef, {
      accountLevel: 'free',
      subscriptionStatus: 'inactive',
      wordsLimit: 5000, // 或者你的免费计划的限制
      planExpiryDate: null,
    });
  }

  return NextResponse.json({ received: true });
}