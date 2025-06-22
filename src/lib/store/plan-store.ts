// lib/store/plan-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

export interface SelectedPlan {
  planId: string;
  billingCycle: 'MONTHLY' | 'YEARLY'; // Изменено на uppercase
  plan?: Plan; // Добавляем полный объект плана
}

interface PlanStore {
  selectedPlan: SelectedPlan | null;
  plans: Plan[];
  
  setSelectedPlan: (plan: SelectedPlan) => void;
  clearSelectedPlan: () => void;
  setPlans: (plans: Plan[]) => void;
  getPlanById: (planId: string) => Plan | undefined;
}

export const usePlanStore = create<PlanStore>()(
  persist(
    (set, get) => ({
      selectedPlan: null,
      plans: [],
      
      setSelectedPlan: (plan) => set({ selectedPlan: plan }),
      clearSelectedPlan: () => set({ selectedPlan: null }),
      setPlans: (plans) => set({ plans }),
      
      getPlanById: (planId) => {
        const { plans } = get();
        return plans.find(plan => plan.id === planId);
      },
    }),
    {
      name: 'plan-storage',
      partialize: (state) => ({ selectedPlan: state.selectedPlan }),
    }
  )
);