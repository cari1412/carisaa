"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { plansService } from "@/lib/plans-service";
import { usePlanStore } from "@/lib/store/plan-store";
import { useAuth } from "@/app/providers/auth-provider";
import type { Plan } from "@/lib/store/plan-store";

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const { user } = useAuth();
  
  // Используем Zustand store
  const { plans, setPlans, setSelectedPlan } = usePlanStore();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Если планы уже есть в store, используем их
      if (plans.length > 0) {
        setLoading(false);
        return;
      }
      
      const fetchedPlans = await plansService.getPlans();
      setPlans(fetchedPlans);
    } catch (err) {
      console.error('Failed to load plans:', err);
      setError('Failed to load pricing plans. Using default plans.');
      
      // Fallback to static data if API fails
      const fallbackPlans: Plan[] = [
        {
          id: 'starter',
          name: 'Starter',
          description: 'Perfect for small teams just getting started.',
          priceMonthly: 29,
          priceYearly: 290,
          features: [
            "Up to 10 users",
            "20GB storage",
            "Basic analytics",
            "24/7 support",
            "API access",
          ],
          isPopular: false,
        },
        {
          id: 'professional',
          name: 'Professional',
          description: 'Everything you need to scale your business.',
          priceMonthly: 99,
          priceYearly: 990,
          features: [
            "Up to 50 users",
            "100GB storage",
            "Advanced analytics",
            "Priority 24/7 support",
            "Full API access",
            "Custom integrations",
            "Team collaboration",
          ],
          isPopular: true,
        },
        {
          id: 'enterprise',
          name: 'Enterprise',
          description: 'Advanced features for large organizations.',
          priceMonthly: 299,
          priceYearly: 2990,
          features: [
            "Unlimited users",
            "Unlimited storage",
            "Advanced analytics & AI",
            "Dedicated support team",
            "Full API access",
            "Custom integrations",
            "Team collaboration",
            "White-label options",
            "Dedicated account manager",
            "Custom contract",
            "SLA guarantee",
          ],
          isPopular: false,
        },
      ];
      setPlans(fallbackPlans);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan: Plan) => {
    // Сохраняем выбранный план в Zustand store
    setSelectedPlan({
      planId: plan.id,
      billingCycle: isYearly ? 'YEARLY' : 'MONTHLY',
      plan: plan, // Сохраняем полный объект плана
    });

    // Если пользователь уже авторизован, направляем на страницу оплаты
    if (user && user.emailVerified) {
      router.push('/checkout');
    } else {
      // Иначе направляем на регистрацию
      router.push('/signup');
    }
  };

  if (loading) {
    return (
      <section id="pricing" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choose the perfect plan for your needs
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          Start with a 14-day free trial. No credit card required. Cancel anytime.
        </p>

        {error && (
          <div className="mt-4 mx-auto max-w-2xl text-center text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Billing toggle */}
        <div className="mt-16 flex justify-center">
          <div className="grid grid-cols-2 gap-x-1 rounded-full bg-gray-200 p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200">
            <button
              onClick={() => setIsYearly(false)}
              className={cn(
                "cursor-pointer rounded-full px-3 py-1 transition-all",
                !isYearly ? "bg-blue-600 text-white" : "text-gray-500"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={cn(
                "cursor-pointer rounded-full px-3 py-1 transition-all",
                isYearly ? "bg-blue-600 text-white" : "text-gray-500"
              )}
            >
              Yearly
              <span className="ml-1 text-xs text-blue-600">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {plans.map((plan, planIdx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: planIdx * 0.1 }}
              viewport={{ once: true }}
              className={cn(
                "rounded-3xl p-8 xl:p-10",
                plan.isPopular
                  ? "bg-gray-900 ring-2 ring-blue-600"
                  : "bg-white ring-1 ring-gray-200"
              )}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3
                  className={cn(
                    "text-lg font-semibold leading-8",
                    plan.isPopular ? "text-white" : "text-gray-900"
                  )}
                >
                  {plan.name}
                </h3>
                {plan.isPopular && (
                  <p className="rounded-full bg-blue-600 px-2.5 py-1 text-xs font-semibold leading-5 text-white">
                    Most popular
                  </p>
                )}
              </div>
              <p className={cn("mt-4 text-sm leading-6", plan.isPopular ? "text-gray-300" : "text-gray-600")}>
                {plan.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span
                  className={cn(
                    "text-4xl font-bold tracking-tight",
                    plan.isPopular ? "text-white" : "text-gray-900"
                  )}
                >
                  ${isYearly ? plan.priceYearly : plan.priceMonthly}
                </span>
                <span className={cn("text-sm font-semibold leading-6", plan.isPopular ? "text-gray-300" : "text-gray-600")}>
                  /{isYearly ? "year" : "month"}
                </span>
              </p>
              <button
                onClick={() => handleSelectPlan(plan)}
                className={cn(
                  "mt-8 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors",
                  plan.isPopular
                    ? "bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-600"
                    : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                )}
              >
                {user && user.emailVerified ? 'Subscribe now' : 'Start free trial'}
              </button>
              <ul
                role="list"
                className={cn(
                  "mt-8 space-y-3 text-sm leading-6",
                  plan.isPopular ? "text-gray-300" : "text-gray-600"
                )}
              >
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check
                      className={cn("h-6 w-5 flex-none", plan.isPopular ? "text-blue-400" : "text-blue-600")}
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}