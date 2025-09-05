import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForgotPassword, useResetPassword } from "@/hooks/useAuth";
import type { ForgotPasswordForm, ResetPasswordForm } from "@/types/types";

// Define form validation schemas
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

export default function ForgotPassword() {
  const { t } = useTranslation();
  const { forgotPasswordMutation, isPending: isForgotPasswordPending } =
    useForgotPassword();
  const { resetPasswordMutation, isPending: isResetPasswordPending } =
    useResetPassword();
  const [showPassword, setShowPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [searchParams] = useSearchParams();
  const emailFromParams = searchParams.get("email") || "";

  // Forgot password form
  const forgotForm = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: emailFromParams,
    },
  });

  // Reset password form
  const resetForm = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: emailFromParams,
    },
  });

  const onForgotSubmit = (data: ForgotPasswordForm) => {
    forgotPasswordMutation(data.email);
    setEmailSent(true);
  };

  const onResetSubmit = (data: ResetPasswordForm) => {
    resetPasswordMutation(data);
  };

  const handleBackToForgot = () => {
    setEmailSent(false);
    resetForm.reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="text-center space-y-2">
          <Link
            to="/login"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-2 self-start"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t("Back_to_login")}
          </Link>
          <CardTitle className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            {emailSent ? t("Reset_password") : t("Forgot_password")}
          </CardTitle>
          <p className="text-sm text-gray-500">
            {emailSent
              ? t("Enter_OTP_and_new_password")
              : t("Enter_email_to_reset")}
          </p>
        </CardHeader>
        <CardContent>
          {!emailSent ? (
            // Forgot Password Form
            <form
              onSubmit={forgotForm.handleSubmit(onForgotSubmit)}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="email">{t("Email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...forgotForm.register("email")}
                    className="pl-9 h-11"
                  />
                </div>
                {forgotForm.formState.errors.email && (
                  <p className="text-red-500 text-sm">
                    {forgotForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11"
                disabled={isForgotPasswordPending}
              >
                {isForgotPasswordPending ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("Sending")}
                  </span>
                ) : (
                  t("Send_OTP")
                )}
              </Button>
            </form>
          ) : (
            // Reset Password Form
            <form
              onSubmit={resetForm.handleSubmit(onResetSubmit)}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="reset-email">{t("Email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="you@example.com"
                    {...resetForm.register("email")}
                    className="pl-9 h-11 bg-muted"
                  />
                </div>
                {resetForm.formState.errors.email && (
                  <p className="text-red-500 text-sm">
                    {resetForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp">{t("OTP")}</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  {...resetForm.register("otp")}
                  className="h-11"
                  maxLength={6}
                />
                {resetForm.formState.errors.otp && (
                  <p className="text-red-500 text-sm">
                    {resetForm.formState.errors.otp.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">{t("New_password")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    {...resetForm.register("newPassword")}
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
                {resetForm.formState.errors.newPassword && (
                  <p className="text-red-500 text-sm">
                    {resetForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-11"
                  onClick={handleBackToForgot}
                >
                  {t("Back")}
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-11"
                  disabled={isResetPasswordPending}
                >
                  {isResetPasswordPending ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t("Resetting")}
                    </span>
                  ) : (
                    t("Reset_password")
                  )}
                </Button>
              </div>
            </form>
          )}

          <p className="text-sm text-center mt-6 text-gray-600">
            {t("Remember_password")}{" "}
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
