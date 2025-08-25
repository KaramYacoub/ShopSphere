import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ShoppingCart,
  Sun,
  Moon,
  Languages,
  User,
  ChevronDown,
  Menu,
  Heart,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "../context/theme-provider";
import { useCheckAuth, useLogout } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import Loader from "@/components/ui/loader";
import { Separator } from "@/components/ui/separator";

export function Navbar() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { isAuthenticated } = useCheckAuth();
  const { logoutMutation, isPending } = useLogout();
  const { data } = useCart();
  const cartItems = data?.cart?.items?.length || 0;

  const url = location.pathname;
  const isLoginOrSignup = url === "/login" || url === "/signup";

  const changeLanguage = (lng: string) => i18n.changeLanguage(lng);

  if (isPending) return <Loader />;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="relative flex items-center justify-between h-16 px-4 md:px-8">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-primary">
          ShopSphere
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 space-x-6">
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
        <div className="hidden md:flex items-center space-x-2">
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

          {/* Cart */}
          <Link to="/cart">
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {cartItems}
                </span>
              )}
            </Button>
          </Link>

          {/* Auth/Profile */}
          {!isAuthenticated && !isLoginOrSignup ? (
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
          ) : (
            isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1">
                    <User className="h-4 w-4" />
                    Profile
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link to="/orders">
                      <ShoppingCart className="mr-2 h-4 w-4" />{" "}
                      <span>{t("navbar.orders")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      {" "}
                      <User className="mr-2 h-4 w-4" />
                      <span>{t("navbar.profile")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wishlist">
                      {" "}
                      <Heart className="mr-2 h-4 w-4" />
                      <span>{t("navbar.wishlist")}</span>
                    </Link>
                  </DropdownMenuItem>

                  <Separator className="mt-2 bg-muted-foreground" />

                  <DropdownMenuItem
                    onClick={() => logoutMutation()}
                    className="text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />{" "}
                    <span>{t("navbar.logout")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="p-4">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-lg font-medium">
                {t("navbar.home")}
              </Link>
              <Link to="/products" className="text-lg font-medium">
                {t("navbar.products")}
              </Link>
              <Link to="/about" className="text-lg font-medium">
                {t("navbar.about")}
              </Link>
              <Link to="/contact" className="text-lg font-medium">
                {t("navbar.contact")}
              </Link>
            </nav>
            <div className="mt-6 flex flex-col space-y-3">
              <Button
                variant="outline"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </Button>
              <Button variant="outline" onClick={() => changeLanguage("en")}>
                English
              </Button>
              <Button variant="outline" onClick={() => changeLanguage("ar")}>
                العربية
              </Button>
              <Link to="/cart">
                <Button
                  variant="outline"
                  className="w-full flex justify-between"
                >
                  Cart
                  {cartItems > 0 && (
                    <span className="ml-2 rounded-full bg-primary text-primary-foreground text-xs px-2">
                      {cartItems}
                    </span>
                  )}
                </Button>
              </Link>
              {!isAuthenticated ? (
                <>
                  <Link to="/login">
                    <Button className="w-full">{t("Login")}</Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="outline" className="w-full">
                      {t("Sign_up")}
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard">
                    <Button className="w-full">Dashboard</Button>
                  </Link>
                  <Button
                    variant="destructive"
                    onClick={() => logoutMutation()}
                    className="w-full"
                  >
                    Logout
                  </Button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
