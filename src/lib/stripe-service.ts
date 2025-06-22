// lib/stripe-service.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dev.prospecttrade.org/api';

export interface CreateCheckoutSessionData {
  planId: string;
  billingCycle: 'MONTHLY' | 'YEARLY';
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutSession {
  sessionId: string;
  url: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'PENDING' | 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'SUSPENDED' | 'PAST_DUE';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodEnd?: string;
  billingCycle: 'MONTHLY' | 'YEARLY';
  plan?: any;
}

class StripeService {
  // Создаем сессию оплаты
  async createCheckoutSession(
    data: CreateCheckoutSessionData,
    accessToken: string
  ): Promise<CheckoutSession> {
    try {
      const requestBody: any = {
        planId: data.planId,
        billingCycle: data.billingCycle,
      };

      // Добавляем URL если они переданы
      if (data.successUrl) {
        requestBody.successUrl = data.successUrl;
      }
      if (data.cancelUrl) {
        requestBody.cancelUrl = data.cancelUrl;
      }

      console.log('Creating checkout session with:', requestBody);

      const response = await fetch(`${API_URL}/stripe/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Checkout session creation failed:', responseData);
        throw new Error(responseData.message || 'Failed to create checkout session');
      }

      return responseData;
    } catch (error) {
      console.error('Error in createCheckoutSession:', error);
      throw error;
    }
  }

  // Получаем текущую подписку пользователя
  async getCurrentSubscription(accessToken: string): Promise<Subscription | null> {
    try {
      const response = await fetch(`${API_URL}/subscriptions/current`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch subscription');
      }

      return response.json();
    } catch (error) {
      console.error('Error in getCurrentSubscription:', error);
      throw error;
    }
  }

  // Отменяем подписку
  async cancelSubscription(subscriptionId: string, accessToken: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/stripe/cancel-subscription/${subscriptionId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error in cancelSubscription:', error);
      throw error;
    }
  }

  // Создаем портал для управления подпиской
  async createCustomerPortal(accessToken: string): Promise<{ url: string }> {
    try {
      const response = await fetch(`${API_URL}/stripe/create-portal-session`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create portal session');
      }

      return response.json();
    } catch (error) {
      console.error('Error in createCustomerPortal:', error);
      throw error;
    }
  }
}

export const stripeService = new StripeService();