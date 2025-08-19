import { toast } from "sonner";
import { checkAuth, login, logout, signup, verifyEmail } from "@/lib/api";
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
  const { data, isPending, error, isError } = useQuery({
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
    isAuthenticated: !!data?.user && !isError,
    user: data?.user,
    isPending,
    error,
    isError,
  };
}
