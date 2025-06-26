"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/auth-provider";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
} from "@heroui/react";

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

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Меню для мобильных устройств
  const menuItems = user 
    ? [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Settings", href: "/settings" },
        { name: "Billing", href: "/billing" },
      ]
    : [
        ...navigation,
        { name: "Log in", href: "/login" },
      ];

  return (
    <Navbar 
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
      className="bg-white/95 backdrop-blur-md border-b"
      maxWidth="xl"
      position="sticky"
    >
      {/* Mobile menu toggle - показывается только на мобильных */}
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      {/* Brand - всегда видим */}
      <NavbarBrand>
        <Link href="/" className="-m-1.5 p-1.5">
          <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            SaaS Platform
          </p>
        </Link>
      </NavbarBrand>

      {/* Desktop navigation - скрыт на мобильных */}
      {!user && (
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
      )}

      {/* Desktop auth section */}
      <NavbarContent justify="end">
        {!loading && (
          <>
            {user ? (
              <>
                {/* Desktop user menu */}
                <NavbarItem className="hidden sm:flex gap-4">
                  <Link 
                    href="/dashboard"
                    className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Button
                    color="danger"
                    variant="light"
                    size="sm"
                    onPress={handleLogout}
                  >
                    Log out
                  </Button>
                </NavbarItem>
                {/* Mobile user info */}
                <NavbarItem className="sm:hidden">
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                </NavbarItem>
              </>
            ) : (
              <>
                <NavbarItem className="hidden sm:flex">
                  <Link 
                    href="/login"
                    className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
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
                    className="hidden sm:flex bg-blue-600 text-white font-semibold"
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

      {/* Mobile menu */}
      <NavbarMenu className="pt-6">
        {menuItems.map((item, index) => (
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
        {user && (
          <NavbarMenuItem className="mt-4 pt-4 border-t">
            <Button
              className="w-full"
              color="danger"
              variant="light"
              onPress={handleLogout}
            >
              Log out
            </Button>
          </NavbarMenuItem>
        )}
      </NavbarMenu>
    </Navbar>
  );
}