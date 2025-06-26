"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button
} from "@heroui/react";
import { ChevronDown, User, LogOut, Settings, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/app/providers/auth-provider";

const navigation = [
  { name: "Features", href: "/features" },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Для неавторизованных пользователей
  const UnauthorizedNavbar = () => (
    <Navbar 
      onMenuOpenChange={setIsMenuOpen}
      className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="min-[672px]:hidden"
        />
        <NavbarBrand>
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              SaaS Platform
            </span>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Десктопные ссылки (>=672px) */}
      <NavbarContent className="hidden min-[672px]:flex gap-4 lg:gap-x-12" justify="center">
        {navigation.map((item) => (
          <NavbarItem key={item.name}>
            <Link
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors"
              href={item.href}
            >
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Правые элементы */}
      <NavbarContent justify="end">
        <NavbarItem className="hidden min-[672px]:flex">
          <Link
            href="/login"
            className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors"
          >
            Log in
          </Link>
        </NavbarItem>
        <NavbarItem className="hidden min-[672px]:flex">
          <Button
            as={Link}
            href="/signup"
            color="primary"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
          >
            Get started
          </Button>
        </NavbarItem>
        <NavbarItem className="min-[672px]:hidden">
          <Link
            href="/signup"
            className="rounded-full border border-gray-900 px-5 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors"
          >
            Sign Up
          </Link>
        </NavbarItem>
      </NavbarContent>

      {/* Мобильное меню (<672px) */}
      <NavbarMenu>
        {navigation.map((item) => (
          <NavbarMenuItem key={item.name}>
            <Link
              className="w-full text-gray-900 hover:text-blue-600"
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          <Link
            className="w-full text-gray-900 hover:text-blue-600"
            href="/login"
            onClick={() => setIsMenuOpen(false)}
          >
            Log in
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );

  return (
    <header>
      {!loading && (
        <>
          {user ? (
            // Авторизованный пользователь - текущая реализация
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 sm:p-6 lg:px-8" aria-label="Global">
              <div className="flex items-center gap-x-4">
                <Link href="/" className="-m-1.5 p-1.5">
                  <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    SaaS Platform
                  </span>
                </Link>
              </div>

              <div className="flex items-center">
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
              </div>
            </nav>
          ) : (
            // Неавторизованный пользователь - HeroUI компоненты
            <UnauthorizedNavbar />
          )}
        </>
      )}
    </header>
  );
}