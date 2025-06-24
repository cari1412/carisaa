// lib/stripe-checkout-helper.ts
import { stripeService } from '@/lib/stripe-service';
import { authService } from '@/lib/auth-service';

export interface CheckoutOptions {
  planId: string;
  billingCycle: 'MONTHLY' | 'YEARLY';
  onError?: (error: Error) => void;
}

export const redirectToStripeCheckout = async ({
  planId,
  billingCycle,
  onError
}: CheckoutOptions): Promise<void> => {
  try {
    const accessToken = authService.getAccessToken();
    if (!accessToken) {
      throw new Error('No access token available');
    }

    console.log('Creating checkout session for:', {
      planId,
      billingCycle,
      origin: window.location.origin
    });

    // Используем динамические URL на основе текущего домена
    const baseUrl = window.location.origin;
    
    // Создаем сессию оплаты Stripe
    const session = await stripeService.createCheckoutSession(
      {
        planId,
        billingCycle,
        successUrl: `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${baseUrl}/payment-cancelled`,
      },
      accessToken
    );

    console.log('Checkout session created:', session);

    // Сохраняем данные о платеже перед редиректом
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pendingPayment', JSON.stringify({
        planId,
        billingCycle,
        timestamp: Date.now()
      }));
    }

    // Перенаправляем на Stripe Checkout
    if (session.url) {
      window.location.href = session.url;
    } else {
      throw new Error('No checkout URL received');
    }
  } catch (error) {
    console.error('Checkout error:', error);
    if (onError) {
      onError(error instanceof Error ? error : new Error('Failed to create checkout session'));
    } else {
      throw error;
    }
  }
};