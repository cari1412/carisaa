// app/verify-email/page.tsx
'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, CheckCircle2, Loader2, Mail } from 'lucide-react';
import { usePlanStore } from '@/lib/store/plan-store';
import { authService } from '@/lib/auth-service';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dev.prospecttrade.org/api';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // Получаем выбранный план из store
  const selectedPlan = usePlanStore((state) => state.selectedPlan);

  useEffect(() => {
    if (!email) {
      router.push('/register');
    }
  }, [email, router]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedCode = value.slice(0, 6).split('');
      const newCode = [...code];
      pastedCode.forEach((digit, i) => {
        if (index + i < 6) {
          newCode[index + i] = digit;
        }
      });
      setCode(newCode);
      
      // Focus last input or next empty input
      const lastFilledIndex = Math.min(index + pastedCode.length - 1, 5);
      inputRefs.current[lastFilledIndex]?.focus();
    } else {
      // Handle single digit
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      
      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      setError('Please enter a complete 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code: verificationCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      // Сохраняем токены авторизации
      if (data.accessToken && data.refreshToken) {
        authService.setTokens(data.accessToken, data.refreshToken);
        if (data.user) {
          authService.setUser(data.user);
        }
      }

      setSuccess(true);
      
      setTimeout(() => {
        // Обновляем страницу чтобы AuthContext подхватил новые токены
        if (selectedPlan) {
          window.location.href = '/checkout';
        } else {
          window.location.href = '/dashboard';
        }
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    setResendLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend code');
      }

      setResendCooldown(60); // 60 second cooldown
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend code');
    } finally {
      setResendLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Email Verified!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {selectedPlan 
                ? 'Redirecting to complete your subscription...' 
                : 'Redirecting to dashboard...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-indigo-100">
            <Mail className="h-6 w-6 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We&apos;ve sent a verification code to
          </p>
          <p className="text-center text-sm font-medium text-gray-900">
            {email}
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 text-center mb-4">
              Enter 6-digit code
            </label>
            <div className="flex justify-center space-x-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                  autoFocus={index === 0}
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              onClick={handleVerify}
              disabled={isLoading || code.some((d) => !d)}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={handleResendCode}
              disabled={resendLoading || resendCooldown > 0}
              className="text-sm text-indigo-600 hover:text-indigo-500 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {resendLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Sending...
                </span>
              ) : resendCooldown > 0 ? (
                `Resend code in ${resendCooldown}s`
              ) : (
                <>Didn&apos;t receive a code? Resend</>
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={() => router.push('/register')}
              className="text-sm text-gray-600 hover:text-gray-500"
            >
              ← Back to registration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Основной компонент с Suspense
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}