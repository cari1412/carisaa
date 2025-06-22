// app/checkout/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CreditCard, AlertCircle } from 'lucide-react';
import { useAuth } from '@/app/providers/auth-provider';
import { usePlanStore } from '@/lib/store/plan-store';
import { stripeService } from '@/lib/stripe-service';
import { authService } from '@/lib/auth-service';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { selectedPlan, getPlanById, clearSelectedPlan, setSelectedPlan } = usePlanStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');

  // Получаем план из selectedPlan
  const plan = selectedPlan?.plan || (selectedPlan ? getPlanById(selectedPlan.planId) : null);

  useEffect(() => {
    console.log('Checkout page - selectedPlan:', selectedPlan);
    console.log('Checkout page - user:', user);
    console.log('Checkout page - authLoading:', authLoading);

    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && !user.emailVerified) {
      router.push('/verify-email');
      return;
    }

    // Если нет выбранного плана, перенаправляем на страницу с ценами
    if (user && !selectedPlan) {
      console.log('No selected plan, redirecting to pricing');
      router.push('/#pricing');
      return;
    }

    // Устанавливаем billingCycle из выбранного плана
    if (selectedPlan) {
      setBillingCycle(selectedPlan.billingCycle);
    }
  }, [user, authLoading, selectedPlan, router]);

  const handleBillingCycleChange = (newCycle: 'MONTHLY' | 'YEARLY') => {
    setBillingCycle(newCycle);
    // Обновляем выбранный план в store с новым billing cycle
    if (selectedPlan && selectedPlan.plan) {
      setSelectedPlan({
        ...selectedPlan,
        billingCycle: newCycle,
      });
    }
  };

  const handleCheckout = async () => {
    if (!plan || !user || !selectedPlan) return;

    try {
      setLoading(true);
      setError('');

      const accessToken = authService.getAccessToken();
      if (!accessToken) {
        router.push('/login');
        return;
      }

      console.log('Creating checkout session for:', {
        planId: plan.id,
        billingCycle,
      });

      // Создаем сессию оплаты Stripe
      const session = await stripeService.createCheckoutSession(
        {
          planId: selectedPlan.planId,
          billingCycle,
          // Передаем URL с параметром session_id для Stripe
          successUrl: 'https://carisaa.vercel.app/payment-success?session_id={CHECKOUT_SESSION_ID}',
          cancelUrl: 'https://carisaa.vercel.app/payment-cancelled',
        },
        accessToken
      );

      console.log('Checkout session created:', session);

      // Перенаправляем на Stripe Checkout
      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create checkout session');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!plan || !selectedPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No plan selected</p>
          <button
            onClick={() => router.push('/#pricing')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View pricing plans
          </button>
        </div>
      </div>
    );
  }

  const price = billingCycle === 'YEARLY' ? plan.priceYearly : plan.priceMonthly;
  const savings = billingCycle === 'YEARLY' ? (plan.priceMonthly * 12 - plan.priceYearly) : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-8 text-white">
            <h1 className="text-2xl font-bold">Complete your subscription</h1>
            <p className="mt-2 text-blue-100">
              You're subscribing to {plan.name}
            </p>
          </div>

          {/* Plan details */}
          <div className="p-6 space-y-6">
            {/* Billing cycle toggle */}
            <div>
              <label className="text-sm font-medium text-gray-700">Billing cycle</label>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleBillingCycleChange('MONTHLY')}
                  className={`px-4 py-3 rounded-md border transition-all ${
                    billingCycle === 'MONTHLY'
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">Monthly</div>
                  <div className="text-sm mt-1">${plan.priceMonthly}/month</div>
                </button>
                <button
                  onClick={() => handleBillingCycleChange('YEARLY')}
                  className={`px-4 py-3 rounded-md border transition-all ${
                    billingCycle === 'YEARLY'
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">Yearly</div>
                  <div className="text-sm mt-1">${plan.priceYearly}/year</div>
                  {savings > 0 && (
                    <div className="text-xs text-green-600 mt-1">Save ${savings.toFixed(2)}</div>
                  )}
                </button>
              </div>
            </div>

            {/* Price summary */}
            <div className="border-t border-b py-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-medium text-gray-900">{plan.name} Plan</p>
                  <p className="text-sm text-gray-500">
                    Billed {billingCycle === 'YEARLY' ? 'annually' : 'monthly'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">${price}</p>
                  <p className="text-sm text-gray-500">
                    /{billingCycle === 'YEARLY' ? 'year' : 'month'}
                  </p>
                </div>
              </div>
              
              {/* Trial notice */}
              <div className="mt-3 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>14-day free trial included.</strong> You won't be charged until the trial ends.
                </p>
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">What's included:</h3>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-4">
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Continue to payment
                  </>
                )}
              </button>
              
              <button
                onClick={() => {
                  clearSelectedPlan();
                  router.push('/#pricing');
                }}
                className="w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Choose a different plan
              </button>
            </div>

            {/* Security badges */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  SSL Encrypted
                </div>
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                  Secure Payment
                </div>
              </div>
              <p className="text-xs text-center text-gray-500 mt-3">
                By subscribing, you agree to our Terms of Service and Privacy Policy.
                You can cancel your subscription at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}