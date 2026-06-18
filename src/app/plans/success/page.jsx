import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { FiCheckCircle, FiMail, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { createPayment } from '@/lib/actions/payments';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function upgradePlan(email) {
    await fetch(`${API_BASE}/api/users/plan`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, plan: 'founder_premium' }),
    });
}

export default async function PaymentSuccessPage({ searchParams }) {
    const { session_id } = await searchParams;

    if (!session_id) redirect('/plans');

    const {
        status,
        customer_details: { email: customerEmail },
        metadata,
        amount_total,
        id: transactionId,
    } = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ['line_items', 'payment_intent'],
    });

    if (status === 'open') redirect('/');

    if (status === 'complete') {
        // 1. Save payment record in our backend
        await createPayment({
            user_email:      customerEmail,
            amount:          amount_total / 100,
            transaction_id:  transactionId,
            payment_status:  'paid',
            paid_at:         new Date(),
        }).catch(() => {});

        // 2. Update user plan to premium
        await upgradePlan(customerEmail).catch(() => {});

        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center px-6">
                <div className="relative max-w-md w-full bg-base-100 border border-base-300 rounded-2xl p-8 shadow-xl text-center overflow-hidden">

                    {/* Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-success/10 rounded-full blur-3xl pointer-events-none" />

                    {/* Icon */}
                    <div className="w-16 h-16 bg-success/10 border border-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiCheckCircle size={32} className="text-success" />
                    </div>

                    {/* Text */}
                    <h1 className="text-2xl font-black text-base-content tracking-tight mb-2">
                        Payment Successful!
                    </h1>
                    <p className="text-sm text-base-content/60 leading-relaxed mb-6">
                        Welcome to{' '}
                        <span className="text-secondary font-bold">StartupForge Premium</span>.
                        Your account has been upgraded and you can now post unlimited opportunities.
                    </p>

                    {/* Receipt box */}
                    <div className="bg-base-200 border border-base-300 rounded-xl p-4 text-left mb-8 flex flex-col gap-3">
                        <div className="flex items-center gap-2.5 text-xs text-base-content/60">
                            <FiMail size={13} className="text-secondary shrink-0" />
                            <div>
                                <p className="font-semibold text-base-content/50 mb-0.5">Confirmation sent to</p>
                                <p className="text-base-content font-medium">{customerEmail}</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <Link
                            href="/dashboard/founder/add-opportunity"
                            className="btn btn-secondary rounded-xl w-full btn-sm gap-2 font-bold"
                        >
                            Post Opportunity <FiArrowRight size={14} />
                        </Link>
                        <Link
                            href="/dashboard/founder"
                            className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-base-content/40 hover:text-base-content transition py-1"
                        >
                            <FiArrowLeft size={13} /> Go to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}