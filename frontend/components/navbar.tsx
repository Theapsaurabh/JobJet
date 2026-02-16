"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Home,
  Info,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { ModeToggle } from "./mode-toggle";

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isAuth = true;

  const logoutHandler = () => {
    console.log("Logout clicked");
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight"
            onClick={closeMobile}
          >
            <span className="bg-gradient-to-r from-blue-600 to-blue-900 bg-clip-text text-transparent">
              Job
            </span>
            <span className="text-red-500">Jet</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <NavItem href="/" icon={<Home size={16} />} label="Home" pathname={pathname} />
            <NavItem href="/jobs" icon={<Briefcase size={16} />} label="Jobs" pathname={pathname} />
            <NavItem href="/about" icon={<Info size={16} />} label="About" pathname={pathname} />
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            {isAuth ? (
              <UserPopover logoutHandler={logoutHandler} />
            ) : (
              <Link href="/login">
                <Button className="gap-2">
                  <User size={16} />
                  Sign In
                </Button>
              </Link>
            )}
            <ModeToggle />
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background shadow-lg">
          <div className="flex flex-col px-4 py-4 space-y-3">
            <MobileNavItem href="/" label="Home" pathname={pathname} onClick={closeMobile} />
            <MobileNavItem href="/jobs" label="Jobs" pathname={pathname} onClick={closeMobile} />
            <MobileNavItem href="/about" label="About" pathname={pathname} onClick={closeMobile} />

            <div className="pt-3 border-t flex justify-between items-center">
              {isAuth ? (
                <Button variant="ghost" onClick={logoutHandler}>
                  Logout
                </Button>
              ) : (
                <Link href="/login" onClick={closeMobile}>
                  <Button>Sign In</Button>
                </Link>
              )}

              <ModeToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

/* ---------- Desktop Nav Item ---------- */

const NavItem = ({
  href,
  icon,
  label,
  pathname,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  pathname: string;
}) => {
  const isActive = pathname === href;

  return (
    <Link href={href}>
      <Button
        variant="ghost"
        className={`flex items-center gap-2 font-medium ${
          isActive ? "text-blue-600" : ""
        }`}
      >
        {icon}
        {label}
      </Button>
    </Link>
  );
};

/* ---------- Mobile Nav Item ---------- */

const MobileNavItem = ({
  href,
  label,
  pathname,
  onClick,
}: {
  href: string;
  label: string;
  pathname: string;
  onClick: () => void;
}) => {
  const isActive = pathname === href;

  return (
    <Link href={href} onClick={onClick}>
      <div
        className={`py-2 text-sm font-medium transition-colors ${
          isActive ? "text-blue-600" : "hover:text-blue-600"
        }`}
      >
        {label}
      </div>
    </Link>
  );
};

/* ---------- User Popover ---------- */

const UserPopover = ({
  logoutHandler,
}: {
  logoutHandler: () => void;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center hover:opacity-80 transition-opacity">
          <Avatar className="h-9 w-9 ring-2 ring-blue-500 ring-offset-2 ring-offset-background">
            <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900">
              S
            </AvatarFallback>
          </Avatar>
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-56 p-2">
        <div className="mb-2 border-b px-3 py-2">
          <p className="text-sm font-semibold">Saurabh</p>
          <p className="truncate text-xs opacity-60">
            saurabh@gmail.com
          </p>
        </div>

        <Link href="/account">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
          >
            <User size={16} />
            My Profile
          </Button>
        </Link>

        <Button
          variant="ghost"
          className="w-full justify-start gap-2 mt-1"
          onClick={logoutHandler}
        >
          <LogOut size={16} />
          Logout
        </Button>
      </PopoverContent>
    </Popover>
  );
};
