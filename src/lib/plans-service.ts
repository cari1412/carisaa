// lib/plans-service.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dev.prospecttrade.org/api';

export interface Plan {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  stripePriceIdMonthly?: string;
  stripePriceIdYearly?: string;
  isPopular: boolean;
}

class PlansService {
  // Получаем все планы с бэкенда
  async getPlans(): Promise<Plan[]> {
    const response = await fetch(`${API_URL}/plans`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch plans');
    }

    return response.json();
  }

  // Получаем план по ID
  async getPlanById(planId: string): Promise<Plan> {
    const response = await fetch(`${API_URL}/plans/${planId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch plan');
    }

    return response.json();
  }

  // Обновляем выбранный план для пользователя (после авторизации)
  async updateUserSelectedPlan(planId: string, accessToken: string): Promise<void> {
    const response = await fetch(`${API_URL}/users/selected-plan`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ planId }),
    });

    if (!response.ok) {
      throw new Error('Failed to update selected plan');
    }
  }
}

export const plansService = new PlansService();