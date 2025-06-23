// app/payment-success/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '@/app/providers/auth-provider';
import { stripeService } from '@/lib/stripe-service';
import { authService } from '@/lib/auth-service';

interface Subscription {
  id: string;
  planId: string;
  billingCycle: 'MONTHLY' | 'YEARLY';
  status: string;
  currentPeriodEnd?: string;
  plan?: {
    name: string;
  };
}

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, checkAuth, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  
  // Отладочная информация
  useEffect(() => {
    console.log('=== Payment Success Debug ===');
    console.log('Session ID:', searchParams.get('session_id'));
    console.log('Pending payment data:', sessionStorage.getItem('pendingPayment'));
    if (authService.debugAuthState) {
      authService.debugAuthState();
    }
    console.log('===========================');
  }, [searchParams]);

  // Первым делом проверяем авторизацию
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        console.log('Payment success - Starting auth verification...');
        console.log('Current auth state:', { user, authLoading });
        
        // Проверяем есть ли токен в localStorage
        const accessToken = authService.getAccessToken();
        console.log('Access token exists:', !!accessToken);
        
        if (!accessToken) {
          console.log('No access token found, redirecting to login');
          router.push('/login');
          return;
        }

        // Если пользователя нет в контексте, но есть токен - пробуем обновить
        if (!user && !authLoading) {
          console.log('User not in context, checking auth...');
          await checkAuth();
          // Даем время на обновление состояния
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        setAuthChecked(true);
      } catch (error) {
        console.error('Auth verification failed:', error);
        router.push('/login');
      }
    };

    verifyAuth();
  }, []); // Запускаем только при монтировании

  // Загружаем подписку только после проверки авторизации
  useEffect(() => {
    if (authChecked && user) {
      loadSubscription();
    }
  }, [authChecked, user]);

  const loadSubscription = async () => {
    try {
      const accessToken = authService.getAccessToken();
      if (!accessToken) {
        console.error('No access token for loading subscription');
        router.push('/login');
        return;
      }

      console.log('Loading subscription...');
      
      // Небольшая задержка для синхронизации данных после оплаты
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Загружаем информацию о подписке
      const sub = await stripeService.getCurrentSubscription(accessToken);
      console.log('Subscription loaded:', sub);
      setSubscription(sub);
    } catch (error) {
      console.error('Failed to load subscription:', error);
      // Не редиректим сразу, возможно подписка еще обрабатывается
      setTimeout(() => loadSubscription(), 2000);
    } finally {
      setLoading(false);
    }
  };

  // Показываем загрузку пока идут проверки
  if (authLoading || !authChecked || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
          <p className="mt-2 text-sm text-gray-600">
            {!authChecked ? 'Verifying authentication...' : 'Loading your subscription...'}
          </p>
        </div>
      </div>
    );
  }

  // Если после всех проверок пользователя нет - редирект
  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Payment successful!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Thank you for subscribing. Your subscription is now active.
          </p>
        </div>

        {subscription ? (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Subscription details
            </h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Plan:</dt>
                <dd className="font-medium text-gray-900">{subscription.plan?.name || 'N/A'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Billing cycle:</dt>
                <dd className="font-medium text-gray-900">
                  {subscription.billingCycle === 'YEARLY' ? 'Annual' : 'Monthly'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Status:</dt>
                <dd className="font-medium text-green-600">Active</dd>
              </div>
              {subscription.currentPeriodEnd && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Next billing date:</dt>
                  <dd className="font-medium text-gray-900">
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        ) : (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-800">
              Your subscription is being processed. This may take a few moments...
            </p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to Dashboard
          </button>
          
          {subscription && (
            <button
              onClick={async () => {
                try {
                  const accessToken = authService.getAccessToken();
                  if (accessToken) {
                    const portal = await stripeService.createCustomerPortal(accessToken);
                    if (portal.url) {
                      window.location.href = portal.url;
                    }
                  }
                } catch (error) {
                  console.error('Failed to open billing portal:', error);
                }
              }}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Manage subscription
            </button>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-4">
          A confirmation email has been sent to {user?.email}
        </p>
      </div>
    </div>
  );
}

// Основной компонент с Suspense
export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}