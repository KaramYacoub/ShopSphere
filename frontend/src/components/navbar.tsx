import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ShoppingCart,
  Sun,
  Moon,
  Languages,
  User,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "../context/theme-provider";
import { Link, useLocation } from "react-router-dom";
import { useCheckAuth, useLogout } from "@/hooks/useAuth";
import Loader from "./ui/loader";

export function Navbar() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [cartItems] = useState(0);
  const { isAuthenticated } = useCheckAuth();
  const { logoutMutation, isPending } = useLogout();

  const url = location.pathname;
  const isLoginOrSignup = url === "/login" || url === "/signup";

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  if (isPending) return <Loader />;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="relative flex h-16 items-center justify-between px-4">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">ShopSphere</span>
        </Link>

        {/* Middle: Navigation */}
        <nav className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-6">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            {t("navbar.home")}
          </Link>
          <Link
            to="/products"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            {t("navbar.products")}
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            {t("navbar.about")}
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            {t("navbar.contact")}
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Languages className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => changeLanguage("en")}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage("ar")}>
                العربية
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Switcher */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Cart Button */}
          <Button variant="ghost" size="icon" className="relative rounded-full">
            <ShoppingCart className="h-5 w-5" />
            {cartItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {cartItems}
              </span>
            )}
          </Button>

          {/* Login / Signup Menu */}
          {!isAuthenticated && !isLoginOrSignup && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  <User className="h-4 w-4" />
                  {t("Login")}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to="/login">{t("Login")}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/signup">{t("Sign_up")}</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* User Menu */}
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  <User className="h-4 w-4" />
                  Profile
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link to="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/orders">Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => logoutMutation()}
                  className="text-red-600"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
