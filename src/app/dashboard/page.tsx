// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CreditCard, 
  Loader2, 
  User, 
  Settings, 
  LogOut,
  CheckCircle,
  AlertCircle,
  Calendar,
  TrendingUp,
  Zap
} from 'lucide-react';
import { useAuth } from '@/app/providers/auth-provider';
import { stripeService } from '@/lib/stripe-service';
import { authService } from '@/lib/auth-service';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setError(null);
      const accessToken = authService.getAccessToken();
      if (!accessToken) {
        console.error('No access token available');
        setLoading(false);
        return;
      }

      // Загружаем информацию о подписке
      const sub = await stripeService.getCurrentSubscription(accessToken);
      console.log('Loaded subscription:', sub);
      
      setSubscription(sub);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const accessToken = authService.getAccessToken();
      if (!accessToken) {
        console.error('No access token for portal');
        return;
      }

      const portal = await stripeService.createCustomerPortal(accessToken);
      if (portal.url) {
        window.location.href = portal.url;
      }
    } catch (error) {
      console.error('Failed to open billing portal:', error);
      setError('Failed to open billing portal');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Получаем план из подписки - проверяем оба варианта для совместимости
  const plan = subscription?.planModel || subscription?.plan;
  const hasActiveSubscription = subscription && subscription.status === 'ACTIVE' && plan;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, <span className="font-medium">{user?.name}</span>
              </span>
              <button
                onClick={logout}
                className="text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
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
                <dd className="text-sm font-medium text-gray-900">{user?.name || 'Not set'}</dd>
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
            {hasActiveSubscription ? (
              <>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-gray-500">Plan</dt>
                    <dd className="text-sm font-medium text-gray-900 flex items-center">
                      {plan.name}
                      {plan.isPopular && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          Popular
                        </span>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Price</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {formatPrice(
                        subscription.billingCycle === 'YEARLY' 
                          ? plan.priceYearly / 12
                          : plan.priceMonthly
                      )}
                      /month
                      {subscription.billingCycle === 'YEARLY' && (
                        <span className="text-xs text-gray-500 ml-1">(billed annually)</span>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Status</dt>
                    <dd className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-600 capitalize">{subscription.status.toLowerCase()}</span>
                    </dd>
                  </div>
                  {(subscription.stripeCurrentPeriodEnd || subscription.currentPeriodEnd) && (
                    <div>
                      <dt className="text-sm text-gray-500">Next Billing</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {formatDate(subscription.stripeCurrentPeriodEnd || subscription.currentPeriodEnd)}
                      </dd>
                    </div>
                  )}
                </dl>
                <button
                  onClick={handleManageSubscription}
                  className="mt-4 w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                >
                  Manage Subscription
                </button>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 mb-4">
                  {subscription === null ? 'Loading...' : 'No active subscription'}
                </p>
                <button
                  onClick={() => router.push('/pricing')}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  View Plans
                </button>
              </div>
            )}
          </div>

          {/* Plan Features Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Plan Features</h2>
              <Zap className="h-5 w-5 text-gray-400" />
            </div>
            {hasActiveSubscription && plan?.features ? (
              <ul className="space-y-2">
                {plan.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">Subscribe to unlock features</p>
              </div>
            )}
          </div>
        </div>

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
            {hasActiveSubscription && (
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Subscription activated</p>
                    <p className="text-xs text-gray-500">
                      {plan.name} plan - {subscription.billingCycle?.toLowerCase() || 'monthly'} billing
                    </p>
                  </div>
                </div>
              </div>
            )}
            {user?.emailVerified && (
              <div className="px-6 py-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email verified</p>
                    <p className="text-xs text-gray-500">Your account is fully activated</p>
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
            
            {hasActiveSubscription ? (
              <button
                onClick={handleManageSubscription}
                className="flex items-center justify-center px-4 py-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <CreditCard className="h-5 w-5 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-900">Billing Portal</span>
              </button>
            ) : (
              <button
                onClick={() => router.push('/pricing')}
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