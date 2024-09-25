// @ts-nocheck

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '../../../firebaseConfig';
import { doc, getDoc, updateDoc, runTransaction, setDoc } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const payload = await req.text();
  const sig = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  console.log(`Received event: ${event.type}`);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error(`Error processing event ${event.type}:`, error);
    // 返回 200 OK 以防止 Stripe 重试
    return NextResponse.json({ received: true, error: 'Error processing event' });
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Processing checkout.session.completed');
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!customerId) {
    console.error('No customer ID found in session');
    return;
  }

  try {
    await runTransaction(db, async (transaction) => {
      const userRef = doc(db, 'users', customerId);
      const userDoc = await transaction.get(userRef);

      if (!userDoc.exists()) {
        console.log(`Creating new user document for ${customerId}`);
        const subscriptionDetails = await getSubscriptionDetails(subscriptionId);
        await setDoc(userRef, {
          email: session.customer_details?.email,
          accountLevel: subscriptionDetails.subscriptionType,
          subscriptionStatus: 'active',
          wordsLimit: subscriptionDetails.wordsLimit,
          wordsUsed: 0,
          subscriptionId: subscriptionId,
          wordsExpiry: subscriptionDetails.wordsExpiry,
          lastWordsResetDate: new Date().toISOString(),
        });
      } else {
        console.log(`Updating existing user document for ${customerId}`);
        const userData = userDoc.data();
        if (userData.subscriptionStatus === 'active') {
          console.log(`User ${customerId} already has an active subscription`);
          return;
        }

        const subscriptionDetails = await getSubscriptionDetails(subscriptionId);
        
        transaction.update(userRef, {
          accountLevel: subscriptionDetails.subscriptionType,
          subscriptionStatus: 'active',
          wordsLimit: subscriptionDetails.wordsLimit,
          wordsUsed: 0,
          subscriptionId: subscriptionId,
          wordsExpiry: subscriptionDetails.wordsExpiry,
          lastWordsResetDate: new Date().toISOString(),
        });
      }
    });

    console.log(`Updated subscription for user ${customerId}`);
  } catch (error) {
    console.error(`Error updating user ${customerId}:`, error);
    throw error; // 重新抛出错误以便上层捕获
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  await resetUserWords(customerId);
  console.log(`Reset words for user ${customerId} after successful payment`);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const userRef = doc(db, 'users', customerId);

  await runTransaction(db, async (transaction) => {
    const userDoc = await transaction.get(userRef);
    if (!userDoc.exists()) {
      console.error(`User ${customerId} not found`);
      return;
    }

    const userData = userDoc.data();
    if (userData.subscriptionStatus !== 'active') {
      console.log(`User ${customerId} subscription is already inactive`);
      return;
    }

    transaction.update(userRef, {
      subscriptionStatus: 'past_due',
    });
  });

  console.log(`Updated subscription status to past_due for user ${customerId}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const userRef = doc(db, 'users', customerId);

  await runTransaction(db, async (transaction) => {
    const userDoc = await transaction.get(userRef);
    if (!userDoc.exists()) {
      console.error(`User ${customerId} not found`);
      return;
    }

    transaction.update(userRef, {
      accountLevel: 'free',
      subscriptionStatus: 'inactive',
      wordsLimit: 5000, // 免费计划的限制
      wordsUsed: 0,
      subscriptionId: null,
      wordsExpiry: null,
    });
  });

  console.log(`Subscription cancelled for user ${customerId}`);
}

async function getSubscriptionDetails(subscriptionId: string) {
  console.log(`Fetching subscription details for ${subscriptionId}`);
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = subscription.items.data[0].price.id;
  let subscriptionType, wordsLimit;

  if (priceId === process.env.STRIPE_PRICE_ID_PROMAX) {
    subscriptionType = 'promax';
    wordsLimit = 250000;
  } else if (priceId === process.env.STRIPE_PRICE_ID_PRO) {
    subscriptionType = 'pro';
    wordsLimit = 50000;
  } else {
    throw new Error('Invalid subscription type');
  }

  const now = new Date();
  const wordsExpiry = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

  console.log(`Subscription details: type=${subscriptionType}, limit=${wordsLimit}`);

  return {
    subscriptionType,
    wordsLimit,
    wordsExpiry: wordsExpiry.toISOString(),
    subscriptionId,
  };
}

async function resetUserWords(userId: string) {
  const userRef = doc(db, 'users', userId);
  
  await runTransaction(db, async (transaction) => {
    const userDoc = await transaction.get(userRef);
    if (!userDoc.exists()) {
      console.error(`User ${userId} not found`);
      return;
    }

    const userData = userDoc.data();
    if (userData.subscriptionStatus === 'active') {
      transaction.update(userRef, {
        wordsUsed: 0,
        lastWordsResetDate: new Date().toISOString(),
      });
    }
  });

  console.log(`Reset words for user ${userId}`);
}