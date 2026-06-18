import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe, PLAN_PRICE_ID } from '@/lib/stripe';
import { auth } from '@/lib/auth';

export async function POST(request) {
    try {
        const headersList = await headers();
        const origin = headersList.get('origin');

        const formData = await request.formData();
        const planId = formData.get('plan_id');

        const priceId = PLAN_PRICE_ID[planId];
        if (!priceId) {
            return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
        }

        // get current user email from better-auth session
        const session = await auth.api.getSession({ headers: headersList });
        const userEmail = session?.user?.email;

        const checkoutSession = await stripe.checkout.sessions.create({
            customer_email: userEmail,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            metadata: { planId, userEmail },
            success_url: `${origin}/plans/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:  `${origin}/plans`,
        });

        return NextResponse.redirect(checkoutSession.url, 303);
    } catch (err) {
        return NextResponse.json(
            { error: err.message },
            { status: err.statusCode || 500 },
        );
    }
}