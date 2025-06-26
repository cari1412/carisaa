// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CreditCard, 
  Loader2, 
  User, 
  Settings, 
  CheckCircle,
  AlertCircle,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/app/providers/auth-provider';
import { stripeService } from '@/lib/stripe-service';
import { authService } from '@/lib/auth-service';
import { redirectToStripeCheckout } from '@/lib/stripe-checkout-helper';
import { usePlanStore } from '@/lib/store/plan-store';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  
  // Получаем планы из store
  const { plans } = usePlanStore();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && !user.emailVerified) {
      router.push('/verify-email');
      return;
    }

    if (user) {
      loadDashboardData();
    }
  }, [user, authLoading, router]);

  const loadDashboardData = async () => {
    try {
      const accessToken = authService.getAccessToken();
      if (!accessToken) return;

      // Загружаем информацию о подписке
      const sub = await stripeService.getCurrentSubscription(accessToken);
      setSubscription(sub);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const accessToken = authService.getAccessToken();
      if (!accessToken) return;

      const portal = await stripeService.createCustomerPortal(accessToken);
      if (portal.url) {
        window.location.href = portal.url;
      }
    } catch (error) {
      console.error('Failed to open billing portal:', error);
    }
  };

  const handleSelectPlan = async (planId: string, billingCycle: 'MONTHLY' | 'YEARLY' = 'MONTHLY') => {
    try {
      setCheckoutLoading(true);
      setCheckoutError('');
      
      await redirectToStripeCheckout({
        planId,
        billingCycle,
        onError: (error) => {
          setCheckoutError(error.message);
          setCheckoutLoading(false);
        }
      });
    } catch (error) {
      console.error('Checkout failed:', error);
      setCheckoutError('Failed to start checkout process. Please try again.');
      setCheckoutLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {checkoutError && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{checkoutError}</h3>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Account Info</h2>
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm text-gray-500">Name</dt>
                <dd className="text-sm font-medium text-gray-900">{user?.name}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Email</dt>
                <dd className="text-sm font-medium text-gray-900">{user?.email}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Status</dt>
                <dd className="flex items-center text-sm">
                  {user?.emailVerified ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-600">Verified</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-yellow-600">Unverified</span>
                    </>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          {/* Subscription Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Subscription</h2>
              <CreditCard className="h-5 w-5 text-gray-400" />
            </div>
            {subscription ? (
              <>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-gray-500">Plan</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {subscription.plan?.name || 'Unknown Plan'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Billing Cycle</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {subscription.billingCycle === 'yearly' ? 'Annual' : 'Monthly'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Status</dt>
                    <dd className="flex items-center text-sm">
                      {subscription.status === 'active' ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-green-600">Active</span>
                        </>
                      ) : (
                        <span className="text-gray-600">{subscription.status}</span>
                      )}
                    </dd>
                  </div>
                  {subscription.currentPeriodEnd && (
                    <div>
                      <dt className="text-sm text-gray-500">Next Billing</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                      </dd>
                    </div>
                  )}
                </dl>
                <button
                  onClick={handleManageSubscription}
                  className="mt-4 w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                >
                  Manage Subscription
                </button>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 mb-4">No active subscription</p>
                <button
                  onClick={() => router.push('/#pricing')}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  View Plans
                </button>
              </div>
            )}
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Quick Stats</h2>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Member Since</span>
                <span className="text-sm font-medium text-gray-900">
                  {user && new Date(user.id).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Plan Features</span>
                <span className="text-sm font-medium text-gray-900">
                  {subscription?.plan?.features?.length || 0} included
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Plans Section - показываем только если нет подписки */}
        {!subscription && plans.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Subscribe</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div key={plan.id} className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-2xl font-bold text-gray-900">${plan.priceMonthly}</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <button
                    onClick={() => handleSelectPlan(plan.id, 'MONTHLY')}
                    disabled={checkoutLoading}
                    className="mt-4 w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {checkoutLoading ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        Processing...
                      </span>
                    ) : (
                      'Subscribe Now'
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Section */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Account created</p>
                  <p className="text-xs text-gray-500">Welcome to our platform!</p>
                </div>
              </div>
            </div>
            {subscription && (
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Subscription activated</p>
                    <p className="text-xs text-gray-500">
                      {subscription.plan?.name} plan - {subscription.billingCycle} billing
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/settings')}
              className="flex items-center justify-center px-4 py-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <Settings className="h-5 w-5 text-gray-600 mr-2" />
              <span className="text-sm font-medium text-gray-900">Account Settings</span>
            </button>
            
            {subscription ? (
              <button
                onClick={handleManageSubscription}
                className="flex items-center justify-center px-4 py-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <CreditCard className="h-5 w-5 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-900">Billing Portal</span>
              </button>
            ) : (
              <button
                onClick={() => router.push('/#pricing')}
                className="flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-600 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Subscribe Now</span>
              </button>
            )}
            
            <button
              onClick={() => router.push('/support')}
              className="flex items-center justify-center px-4 py-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <AlertCircle className="h-5 w-5 text-gray-600 mr-2" />
              <span className="text-sm font-medium text-gray-900">Get Support</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}