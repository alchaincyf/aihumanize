import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth, db } from '../../../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  try {
    const { priceId, userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // 获取用户数据
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    let userData;
    if (!userSnap.exists()) {
      // 如果用户文档不存在,创建一个新的
      userData = {
        email: auth.currentUser?.email,
        accountLevel: 'free',
        wordsLimit: 5000,
        wordsUsed: 0,
        subscriptionStatus: 'inactive',
      };
      await setDoc(userRef, userData);
    } else {
      userData = userSnap.data();
    }

    // 检查用户是否已经有一个活跃的订阅
    if (userData.subscriptionStatus === 'active') {
      return NextResponse.json({ error: 'User already has an active subscription' }, { status: 400 });
    }

    // 创建或获取 Stripe 客户
    let customer;
    if (userData.stripeCustomerId) {
      customer = await stripe.customers.retrieve(userData.stripeCustomerId);
    } else {
      customer = await stripe.customers.create({
        email: userData.email,
        metadata: { firebaseUID: userId },
      });
      // 更新用户文档以包含 Stripe 客户 ID
      await setDoc(userRef, { stripeCustomerId: customer.id }, { merge: true });
    }

    // 创建 Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer: customer.id,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
      metadata: {
        firebaseUID: userId,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    console.error('Error in create-payment-intent:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}