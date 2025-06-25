"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, ChevronDown, User, LogOut, Settings, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/app/providers/auth-provider";

const navigation = [
  { name: "Features", href: "/features" },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [userMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      setUserMenuOpen(false);
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 sm:p-6 lg:px-8" aria-label="Global">
        <div className="flex items-center gap-x-4">
          {/* Бургер меню для неавторизованных пользователей на маленьких экранах */}
          {!user && (
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 min-[672px]:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          )}
          
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              SaaS Platform
            </span>
          </Link>
          
          {/* Navigation links - показываем только для неавторизованных на больших экранах */}
          {!user && (
            <div className="hidden min-[672px]:flex gap-x-4 lg:gap-x-12">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center">
          {!loading && (
            <>
              {user ? (
                /* Для авторизованных пользователей - дропдаун меню */
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs sm:text-sm">
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <span className="hidden sm:inline">{user.name || user.email}</span>
                    <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-40 sm:w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="h-3 w-3 sm:h-4 sm:w-4" />
                        Dashboard
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                        Settings
                      </Link>
                      <Link
                        href="/billing"
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
                        Billing
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Для неавторизованных пользователей */
                <>
                  {/* Desktop версия (672px и больше) */}
                  <div className="hidden min-[672px]:flex items-center gap-x-4">
                    <Link
                      href="/login"
                      className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/signup"
                      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
                    >
                      Get started
                    </Link>
                  </div>

                  {/* Mobile версия (меньше 672px) - только кнопка Sign Up */}
                  <Link
                    href="/signup"
                    className="min-[672px]:hidden rounded-full border border-gray-900 px-5 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </nav>
      
      {/* Mobile menu - только для неавторизованных пользователей */}
      {!user && mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] min-[672px]:hidden">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          
          {/* Menu panel */}
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-xl">
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-6">
                <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    SaaS Platform
                  </span>
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              
              {/* Navigation */}
              <div className="flex-1 overflow-y-auto px-6">
                <nav className="space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
                
                <hr className="my-6" />
                
                <Link
                  href="/login"
                  className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}