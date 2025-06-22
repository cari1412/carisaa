// app/payment-cancelled/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { XCircle } from 'lucide-react';

export default function PaymentCancelledPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Payment cancelled
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your payment was cancelled. No charges were made.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <button
            onClick={() => router.push('/#pricing')}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View pricing plans
          </button>
          
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to Dashboard
          </button>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Need help? <a href="/contact" className="text-blue-600 hover:text-blue-500">Contact support</a>
        </p>
      </div>
    </div>
  );
}