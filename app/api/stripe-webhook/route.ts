import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '../../../firebaseConfig';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16', // 使用当前支持的最新版本
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  console.log(`Received event: ${event.type}`);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error('Error processing event:', error);
    return NextResponse.json({ error: 'Error processing event' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const customerId = session.client_reference_id;
  const subscriptionId = session.subscription as string;

  if (!customerId) {
    console.error('No customer ID found in session');
    throw new Error('No customer ID found');
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const { subscriptionType, wordsLimit } = getSubscriptionDetails(subscription);

  await updateUserSubscription(customerId, subscriptionType, wordsLimit, subscriptionId);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const customerId = subscription.customer as string;

  const { subscriptionType, wordsLimit } = getSubscriptionDetails(subscription);

  await updateUserSubscription(customerId, subscriptionType, wordsLimit, subscriptionId);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const { subscriptionType, wordsLimit } = getSubscriptionDetails(subscription);
  await updateUserSubscription(customerId, subscriptionType, wordsLimit, subscription.id);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const userRef = doc(db, 'users', customerId);
  await updateDoc(userRef, {
    accountLevel: 'free',
    subscriptionStatus: 'inactive',
    wordsLimit: 5000, // 或者您的免费计划的限制
    subscriptionId: null,
  });
  console.log(`Subscription cancelled for user ${customerId}`);
}

function getSubscriptionDetails(subscription: Stripe.Subscription) {
  const priceId = subscription.items.data[0].price.id;
  let subscriptionType, wordsLimit;

  if (priceId === 'price_1Q2OZ6Bpt9GS2xZNPErDm4eE') { // Pro Max plan
    subscriptionType = 'promax';
    wordsLimit = 250000;
  } else if (priceId === 'price_pro') { // Pro plan
    subscriptionType = 'pro';
    wordsLimit = 50000;
  } else {
    throw new Error('Invalid subscription type');
  }

  return { subscriptionType, wordsLimit };
}

async function updateUserSubscription(customerId: string, subscriptionType: string, wordsLimit: number, subscriptionId: string) {
  const userRef = doc(db, 'users', customerId);
  const userDoc = await getDoc(userRef);

  const now = new Date();
  const expiryDate = new Date(now.setDate(now.getDate() + 30));

  const updateData = {
    accountLevel: subscriptionType,
    subscriptionStatus: 'active',
    wordsLimit: wordsLimit,
    wordsUsed: 0,
    planExpiryDate: expiryDate.toISOString(),
    subscriptionId: subscriptionId,
  };

  if (userDoc.exists()) {
    await updateDoc(userRef, updateData);
  } else {
    await setDoc(userRef, updateData);
  }

  console.log(`Updated user ${customerId} with subscription ${subscriptionType}`);
}