"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/auth-provider";
import { useTheme } from "next-themes";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@heroui/react";
import { Sun, Moon } from "lucide-react";

const navigation = [
  { name: "Features", href: "/features" },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Избегаем проблем с гидратацией
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Меню для мобильных устройств (только для неавторизованных)
  const menuItems = [
    ...navigation,
    { name: "Log in", href: "/login" },
  ];

  return (
    <Navbar 
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
      className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b dark:border-gray-800"
      maxWidth="xl"
      position="sticky"
    >
      {/* Mobile menu toggle - показывается только для неавторизованных на мобильных */}
      {!user && (
        <NavbarContent className="sm:hidden" justify="start">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="dark:text-gray-200"
          />
        </NavbarContent>
      )}

      {/* Brand - всегда видим */}
      <NavbarBrand>
        <Link href="/" className="-m-1.5 p-1.5">
          <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
            SaaS Platform
          </p>
        </Link>
      </NavbarBrand>

      {/* Desktop navigation - только для неавторизованных */}
      {!user && (
        <NavbarContent className="hidden sm:flex gap-6" justify="center">
          {navigation.map((item) => (
            <NavbarItem key={item.name}>
              <Link 
                href={item.href}
                className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {item.name}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>
      )}

      {/* Auth section */}
      <NavbarContent justify="end">
        {/* Theme Switcher - всегда показывается */}
        <NavbarItem>
          {mounted && (
            <Button
              isIconOnly
              variant="light"
              onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
          )}
        </NavbarItem>

        {!loading && (
          <>
            {user ? (
              // Авторизованный пользователь - Avatar с Dropdown
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Avatar
                    isBordered
                    as="button"
                    className="transition-transform"
                    color="primary"
                    name={user.name || user.email}
                    size="sm"
                    fallback={
                      <div className="w-full h-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-medium">
                        {user.name ? user.name[0].toUpperCase() : user.email ? user.email[0].toUpperCase() : 'U'}
                      </div>
                    }
                  />
                </DropdownTrigger>
                <DropdownMenu 
                  aria-label="Profile Actions" 
                  variant="flat"
                  className="dark:bg-gray-800"
                >
                  <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-semibold">Signed in as</p>
                    <p className="font-semibold">{user.email}</p>
                  </DropdownItem>
                  <DropdownItem key="dashboard" href="/dashboard">
                    Dashboard
                  </DropdownItem>
                  <DropdownItem key="settings" href="/settings">
                    My Settings
                  </DropdownItem>
                  <DropdownItem key="billing" href="/billing">
                    Billing
                  </DropdownItem>
                  <DropdownItem key="team_settings">
                    Team Settings
                  </DropdownItem>
                  <DropdownItem key="analytics">
                    Analytics
                  </DropdownItem>
                  <DropdownItem key="help_and_feedback">
                    Help & Feedback
                  </DropdownItem>
                  <DropdownItem 
                    key="logout" 
                    color="danger"
                    onPress={handleLogout}
                  >
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              // Неавторизованный пользователь
              <>
                <NavbarItem className="hidden sm:flex">
                  <Link 
                    href="/login"
                    className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Log in
                  </Link>
                </NavbarItem>
                <NavbarItem>
                  {/* Desktop Sign Up button */}
                  <Button 
                    as={Link}
                    color="primary" 
                    href="/signup" 
                    variant="flat"
                    className="hidden sm:flex bg-blue-600 dark:bg-blue-500 text-white font-semibold"
                  >
                    Get started
                  </Button>
                  {/* Mobile Sign Up button - меньше размер */}
                  <Button 
                    as={Link}
                    color="primary" 
                    href="/signup" 
                    variant="flat"
                    size="sm"
                    className="sm:hidden"
                  >
                    Sign Up
                  </Button>
                </NavbarItem>
              </>
            )}
          </>
        )}
      </NavbarContent>

      {/* Mobile menu - только для неавторизованных */}
      {!user && (
        <NavbarMenu className="pt-6 dark:bg-gray-900">
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item.name}-${index}`}>
              <Link
                className="w-full block py-2 text-base font-semibold text-gray-900 dark:text-gray-100"
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      )}
    </Navbar>
  );
}