"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, User, LogOut, Settings, CreditCard } from "lucide-react";
import { useAuth } from "@/app/providers/auth-provider";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link as HeroUILink,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";

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

  // Для авторизованных пользователей возвращаем простой header
  if (user) {
    return (
      <Navbar 
        className="bg-white/95 backdrop-blur-md border-b"
        maxWidth="xl"
        position="sticky"
      >
        <NavbarContent justify="start">
          <NavbarBrand>
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                SaaS Platform
              </span>
            </Link>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent justify="end">
          {!loading && (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button
                  variant="light"
                  className="gap-1 sm:gap-2 min-w-unit-12 h-unit-12"
                >
                  <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs sm:text-sm">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline">{user.name || user.email}</span>
                  <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="User menu actions">
                <DropdownItem
                  key="dashboard"
                  startContent={<User className="h-4 w-4" />}
                  onClick={() => router.push('/dashboard')}
                >
                  Dashboard
                </DropdownItem>
                <DropdownItem
                  key="settings"
                  startContent={<Settings className="h-4 w-4" />}
                  onClick={() => router.push('/settings')}
                >
                  Settings
                </DropdownItem>
                <DropdownItem
                  key="billing"
                  startContent={<CreditCard className="h-4 w-4" />}
                  onClick={() => router.push('/billing')}
                >
                  Billing
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  startContent={<LogOut className="h-4 w-4" />}
                  onClick={handleLogout}
                >
                  Log out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </NavbarContent>
      </Navbar>
    );
  }

  // Для неавторизованных пользователей используем HeroUI Navbar
  return (
    <Navbar 
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
      className="bg-white/95 backdrop-blur-md border-b"
      maxWidth="xl"
      position="sticky"
    >
      {/* Mobile menu toggle - показываем только на мобильных устройствах */}
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      {/* Brand */}
      <NavbarContent className="pr-3 sm:pr-0" justify="start">
        <NavbarBrand>
          <Link href="/" className="-m-1.5 p-1.5">
            <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              SaaS Platform
            </p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop Navigation Links */}
      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        {navigation.map((item) => (
          <NavbarItem key={item.name}>
            <Link 
              href={item.href}
              className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
            >
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Desktop Auth Buttons */}
      <NavbarContent justify="end">
        <NavbarItem className="hidden sm:flex">
          <Link 
            href="/login"
            className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
          >
            Log in
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Button 
            as={Link}
            color="primary" 
            href="/signup" 
            variant="flat"
            className="hidden sm:flex bg-blue-600 text-white font-semibold"
          >
            Get started
          </Button>
          {/* Mobile Sign Up Button */}
          <Button
            as={Link}
            color="default"
            href="/signup"
            variant="bordered"
            className="sm:hidden font-semibold"
            size="sm"
          >
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className="pt-6">
        {navigation.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link
              className="w-full block py-2 text-base font-semibold text-gray-900"
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem className="mt-4 pt-4 border-t">
          <Link
            className="w-full block py-2 text-base font-semibold text-gray-900"
            href="/login"
            onClick={() => setIsMenuOpen(false)}
          >
            Log in
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}