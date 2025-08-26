import { toast } from "sonner";
import {
  checkAuth,
  forgotPassword,
  login,
  logout,
  resetPassword,
  signup,
  updateProfile,
  verifyEmail,
} from "@/lib/api/authApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function useSignup() {
  const navigate = useNavigate();
  const { mutate: signupMutation, isPending } = useMutation({
    mutationKey: ["signup"],
    mutationFn: signup,
    onSuccess: () => {
      toast.success("Signup successful! Check your email to verify.");
      navigate("/login");
    },
    onError: (err: unknown) => {
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data
      ) {
        toast.error(String(err?.response?.data?.message) || "Signup failed");
      } else {
        toast.error("Signup failed");
      }
    },
  });
  return { signupMutation, isPending };
}

export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: loginMutation, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["check-auth"] });
      toast.success("Logged in successfully. Welcome back!");
      navigate("/");
    },
    onError: (err: unknown) => {
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data
      ) {
        toast.error(
          String(err?.response?.data?.message) || "Invalid credentials"
        );
      } else {
        toast.error("Login failed");
      }
    },
  });
  return { loginMutation, isPending };
}

export function useVerifyEmail() {
  const {
    mutate: verifyMutation,
    isPending,
    isError,
  } = useMutation({
    mutationKey: ["verify-email"],
    mutationFn: verifyEmail,
  });
  return { verifyMutation, isPending, isError };
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { mutate: logoutMutation, isPending } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["check-auth"] });
      toast.success("Logged out successfully. See you soon!");
    },
    onError: (err: unknown) => {
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data
      ) {
        toast.error(String(err?.response?.data?.message) || "Logout failed");
      } else {
        toast.error("Logout failed");
      }
    },
  });
  return { logoutMutation, isPending };
}

export function useCheckAuth() {
  const { data, isPending } = useQuery({
    queryKey: ["check-auth"],
    queryFn: checkAuth,
    retry: false,
    retryOnMount: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  return {
    isAuthenticated: !!data?.user,
    user: data?.user,
    isPending,
  };
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { mutate: updateProfileMutation, isPending } = useMutation({
    mutationKey: ["update-profile"],
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["check-auth"] });
      if (data.message && data.message.includes("email change")) {
        toast.success("Verification email sent to your new email address");
      } else {
        toast.success("Profile updated successfully!");
      }
    },
    onError: (err: unknown) => {
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data
      ) {
        toast.error(String(err?.response?.data?.message) || "Update failed");
      } else {
        toast.error("Update failed");
      }
    },
  });
  return { updateProfileMutation, isPending };
}

export function useForgotPassword() {
  const { mutate: forgotPasswordMutation, isPending } = useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success("OTP sent to your email");
    },
    onError: (err: unknown) => {
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data
      ) {
        toast.error(
          String(err?.response?.data?.message) || "Failed to send OTP"
        );
      } else {
        toast.error("Failed to send OTP");
      }
    },
  });
  return { forgotPasswordMutation, isPending };
}

export function useResetPassword() {
  const { mutate: resetPasswordMutation, isPending } = useMutation({
    mutationKey: ["reset-password"],
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success("Password reset successfully");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    },
    onError: (err: unknown) => {
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data
      ) {
        toast.error(
          String(err?.response?.data?.message) || "Failed to reset password"
        );
      } else {
        toast.error("Failed to reset password");
      }
    },
  });
  return { resetPasswordMutation, isPending };
}
