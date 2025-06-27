"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { plansService } from "@/lib/plans-service";
import { usePlanStore } from "@/lib/store/plan-store";
import { useAuth } from "@/app/providers/auth-provider";
import { redirectToStripeCheckout } from "@/lib/stripe-checkout-helper";
import type { Plan } from "@/lib/store/plan-store";

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
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

  const handleSelectPlan = async (plan: Plan) => {
    // Если пользователь уже авторизован и верифицирован, сразу создаем Stripe сессию
    if (user && user.emailVerified) {
      try {
        setProcessingPlanId(plan.id);
        setError("");
        
        await redirectToStripeCheckout({
          planId: plan.id,
          billingCycle: isYearly ? 'YEARLY' : 'MONTHLY',
          onError: (error) => {
            setError(error.message);
            setProcessingPlanId(null);
          }
        });
      } catch (err) {
        console.error('Checkout failed:', err);
        setError('Failed to start checkout process. Please try again.');
        setProcessingPlanId(null);
      }
    } else {
      // Сохраняем выбранный план в Zustand store для использования после регистрации
      setSelectedPlan({
        planId: plan.id,
        billingCycle: isYearly ? 'YEARLY' : 'MONTHLY',
        plan: plan,
      });
      
      // Направляем на регистрацию
      router.push('/signup');
    }
  };

  if (loading) {
    return (
      <section id="pricing" className="py-24 sm:py-32 bg-white dark:bg-zinc-950 transition-colors">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-white dark:bg-gray-950 transition-colors">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Choose the perfect plan for your needs
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600 dark:text-gray-300">
          Start with a 14-day free trial. No credit card required. Cancel anytime.
        </p>

        {error && (
          <div className="mt-4 mx-auto max-w-2xl text-center text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Billing toggle */}
        <div className="mt-16 flex justify-center">
          <div className="grid grid-cols-2 gap-x-1 rounded-full bg-gray-200 dark:bg-zinc-800 p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200 dark:ring-zinc-700">
            <button
              onClick={() => setIsYearly(false)}
              className={cn(
                "cursor-pointer rounded-full px-3 py-1 transition-all",
                !isYearly 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-500 dark:text-gray-400"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={cn(
                "cursor-pointer rounded-full px-3 py-1 transition-all",
                isYearly 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-500 dark:text-gray-400"
              )}
            >
              Yearly
              <span className={cn(
                "ml-1 text-xs",
                isYearly ? "text-white" : "text-blue-600 dark:text-blue-400"
              )}>Save 20%</span>
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
                "rounded-3xl p-8 xl:p-10 transition-colors",
                plan.isPopular
                  ? "bg-gray-900 dark:bg-blue-950 ring-2 ring-blue-600 dark:ring-blue-500"
                  : "bg-white dark:bg-zinc-900 ring-1 ring-gray-200 dark:ring-zinc-800"
              )}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3
                  className={cn(
                    "text-lg font-semibold leading-8",
                    plan.isPopular ? "text-white" : "text-gray-900 dark:text-white"
                  )}
                >
                  {plan.name}
                </h3>
                {plan.isPopular && (
                  <p className="rounded-full bg-blue-600 dark:bg-blue-500 px-2.5 py-1 text-xs font-semibold leading-5 text-white">
                    Most popular
                  </p>
                )}
              </div>
              <p className={cn(
                "mt-4 text-sm leading-6",
                plan.isPopular ? "text-gray-300" : "text-gray-600 dark:text-gray-400"
              )}>
                {plan.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span
                  className={cn(
                    "text-4xl font-bold tracking-tight",
                    plan.isPopular ? "text-white" : "text-gray-900 dark:text-white"
                  )}
                >
                  ${isYearly ? plan.priceYearly : plan.priceMonthly}
                </span>
                <span className={cn(
                  "text-sm font-semibold leading-6",
                  plan.isPopular ? "text-gray-300" : "text-gray-600 dark:text-gray-400"
                )}>
                  /{isYearly ? "year" : "month"}
                </span>
              </p>
              <button
                onClick={() => handleSelectPlan(plan)}
                disabled={processingPlanId === plan.id}
                className={cn(
                  "mt-8 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                  plan.isPopular
                    ? "bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-600"
                    : "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900"
                )}
              >
                {processingPlanId === plan.id ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Processing...
                  </span>
                ) : (
                  user && user.emailVerified ? 'Subscribe now' : 'Start free trial'
                )}
              </button>
              <ul
                role="list"
                className={cn(
                  "mt-8 space-y-3 text-sm leading-6",
                  plan.isPopular ? "text-gray-300" : "text-gray-600 dark:text-gray-300"
                )}
              >
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check
                      className={cn(
                        "h-6 w-5 flex-none",
                        plan.isPopular ? "text-blue-400" : "text-blue-600 dark:text-blue-400"
                      )}
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