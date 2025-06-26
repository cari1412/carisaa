"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, ChevronDown, User, LogOut, Settings, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/app/providers/auth-provider";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@heroui/navbar";
import { Link as HeroUILink } from "@heroui/link";
import { Button } from "@heroui/button";

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

  // Для авторизованных пользователей используем обычный header
  if (user) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 sm:p-6 lg:px-8" aria-label="Global">
          <div className="flex items-center gap-x-4">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                SaaS Platform
              </span>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center">
            {!loading && (
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
            )}
          </div>
        </nav>
      </header>
    );
  }

  // Для неавторизованных пользователей используем HeroUI Navbar
  return (
    <Navbar 
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
      className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60"
      maxWidth="xl"
      height="4rem"
      position="sticky"
    >
      {/* Mobile menu toggle - только для маленьких экранов */}
      <NavbarContent className="min-[672px]:hidden">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
        <NavbarBrand>
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              SaaS Platform
            </span>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop brand - только для больших экранов */}
      <NavbarContent className="hidden min-[672px]:flex">
        <NavbarBrand>
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              SaaS Platform
            </span>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop navigation links */}
      <NavbarContent className="hidden min-[672px]:flex gap-4" justify="center">
        {navigation.map((item) => (
          <NavbarItem key={item.name}>
            <HeroUILink 
              color="foreground" 
              href={item.href}
              as={Link}
              className="text-sm font-semibold"
            >
              {item.name}
            </HeroUILink>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Desktop auth buttons */}
      <NavbarContent justify="end" className="hidden min-[672px]:flex">
        <NavbarItem>
          <HeroUILink href="/login" as={Link} className="text-sm font-semibold">
            Log in
          </HeroUILink>
        </NavbarItem>
        <NavbarItem>
          <Button 
            as={Link} 
            color="primary" 
            href="/signup" 
            variant="flat"
            className="text-sm font-semibold"
          >
            Get started
          </Button>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Sign Up button */}
      <NavbarContent justify="end" className="min-[672px]:hidden">
        <NavbarItem>
          <Link
            href="/signup"
            className="rounded-full border border-gray-900 px-5 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors"
          >
            Sign Up
          </Link>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile menu */}
      <NavbarMenu>
        {navigation.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <HeroUILink
              className="w-full"
              color="foreground"
              href={item.href}
              size="lg"
              as={Link}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </HeroUILink>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          <HeroUILink
            className="w-full"
            color="foreground"
            href="/login"
            size="lg"
            as={Link}
            onClick={() => setIsMenuOpen(false)}
          >
            Log in
          </HeroUILink>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}