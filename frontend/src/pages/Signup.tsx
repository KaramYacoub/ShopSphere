import { useState } from "react";
import { useSignup } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, User2, Eye, EyeOff, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

type SignupForm = {
  name: string;
  email: string;
  password: string;
};

export default function Signup() {
  const { t } = useTranslation();
  const { signupMutation, isPending } = useSignup();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>();

  const onSubmit = (data: SignupForm) => {
    signupMutation(data);
  };

  const handleSignupWithGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            {t("Create_an_account")}
          </CardTitle>
          <p className="text-sm text-gray-500">{t("Get_started")}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">{t("Full_name")}</Label>
              <div className="relative">
                <User2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  placeholder="Your name"
                  {...register("name", { required: "Name is required" })}
                  className="pl-9 h-11"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">{t("Email")}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
                  })}
                  className="pl-9 h-11"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">{t("Password")}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Min 6 characters" },
                  })}
                  className="pl-9 pr-10 h-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full h-11" disabled={isPending}>
              {isPending ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing up...
                </span>
              ) : (
                t("Create_an_account")
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-primary"></div>
            <span className="px-3 text-sm text-gray-500 dark:text-gray-400">
              {t("Or_continue_with")}
            </span>
            <div className="flex-1 border-t border-primary"></div>
          </div>

          <Button
            variant="outline"
            className="w-full h-11 gap-2"
            onClick={handleSignupWithGoogle}
          >
            {/* Google SVG */}
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 
                1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 
                3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 
                1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 
                20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 
                8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 
                4.21 1.64l3.15-3.15C17.45 2.09 
                14.97 1 12 1 7.7 1 3.99 3.47 
                2.18 7.07l3.66 2.84c.87-2.6 
                3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {t("Continue_with_Google")}
          </Button>

          <p className="text-sm text-center mt-6 text-gray-600">
            {t("Already_have_an_account")}{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:underline"
            >
              {t("Login")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
