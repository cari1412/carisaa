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
  plan?: {
    id: string;
    name: string;
    features: string[];
    priceMonthly: number;
    priceYearly: number;
  };
}

export interface CustomerPortal {
  url: string;
}

export interface PaymentStatus {
  status: 'paid' | 'unpaid' | 'expired';
  subscription?: Subscription;
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

      console.log('Checkout session created successfully:', responseData);
      return responseData;
    } catch (error) {
      console.error('Error in createCheckoutSession:', error);
      throw error;
    }
  }

  // Получаем текущую подписку пользователя
  async getCurrentSubscription(accessToken: string): Promise<Subscription | null> {
    try {
      console.log('Fetching current subscription...');
      
      const response = await fetch(`${API_URL}/subscriptions/current`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log('No subscription found');
          return null;
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch subscription');
      }

      // Проверяем, что ответ не пустой
      const text = await response.text();
      if (!text) {
        console.log('Empty response from server');
        return null;
      }

      const subscription = JSON.parse(text);
      
      // Если сервер вернул null или пустой объект без id
      if (!subscription || !subscription.id) {
        console.log('No subscription data');
        return null;
      }

      console.log('Subscription fetched:', subscription);
      return subscription;
    } catch (error) {
      console.error('Error in getCurrentSubscription:', error);
      // Возвращаем null вместо выброса ошибки для более мягкой обработки
      return null;
    }
  }

  // Отменяем подписку
  async cancelSubscription(subscriptionId: string, accessToken: string): Promise<void> {
    try {
      console.log('Cancelling subscription:', subscriptionId);
      
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

      console.log('Subscription cancelled successfully');
    } catch (error) {
      console.error('Error in cancelSubscription:', error);
      throw error;
    }
  }

  // Создаем портал для управления подпиской
  async createCustomerPortal(accessToken: string): Promise<CustomerPortal> {
    try {
      console.log('Creating customer portal session...');
      
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

      const portal = await response.json();
      console.log('Customer portal created:', portal);
      return portal;
    } catch (error) {
      console.error('Error in createCustomerPortal:', error);
      throw error;
    }
  }

  // Проверка статуса платежа по session_id
  async checkPaymentStatus(sessionId: string, accessToken: string): Promise<PaymentStatus> {
    try {
      console.log('Checking payment status for session:', sessionId);
      
      const response = await fetch(`${API_URL}/stripe/check-session/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to check payment status');
      }

      const status = await response.json();
      console.log('Payment status:', status);
      return status;
    } catch (error) {
      console.error('Error checking payment status:', error);
      throw error;
    }
  }

  // Получение списка всех подписок пользователя (если нужно)
  async getUserSubscriptions(accessToken: string): Promise<Subscription[]> {
    try {
      console.log('Fetching user subscriptions...');
      
      const response = await fetch(`${API_URL}/subscriptions`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch subscriptions');
      }

      const subscriptions = await response.json();
      console.log('User subscriptions:', subscriptions);
      return subscriptions;
    } catch (error) {
      console.error('Error in getUserSubscriptions:', error);
      throw error;
    }
  }

  // Обновление платежного метода
  async updatePaymentMethod(accessToken: string): Promise<CustomerPortal> {
    try {
      console.log('Redirecting to update payment method...');
      
      // Используем customer portal для обновления платежного метода
      return await this.createCustomerPortal(accessToken);
    } catch (error) {
      console.error('Error in updatePaymentMethod:', error);
      throw error;
    }
  }

  // Проверка наличия активной подписки
  async hasActiveSubscription(accessToken: string): Promise<boolean> {
    try {
      const subscription = await this.getCurrentSubscription(accessToken);
      return subscription !== null && subscription.status === 'ACTIVE';
    } catch (error) {
      console.error('Error checking active subscription:', error);
      return false;
    }
  }

  // Дебаг метод для проверки состояния Stripe
  debugStripeState(accessToken: string): void {
    console.log('=== Stripe State Debug ===');
    console.log('API URL:', API_URL);
    console.log('Access Token:', accessToken ? 'exists' : 'null');
    console.log('========================');
  }
}

export const stripeService = new StripeService();