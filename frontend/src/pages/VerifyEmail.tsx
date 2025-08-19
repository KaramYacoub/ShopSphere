// src/pages/VerifyEmail.tsx
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useVerifyEmail } from "../hooks/useAuth";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const verified = params.get("verified");
  const error = params.get("error");
  const { verifyMutation, isPending, isError } = useVerifyEmail();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error);
      navigate("/login");
      return;
    }

    if (verified === "true") {
      toast.success("Email verified! You can now login.");
      navigate("/login");
      return;
    }

    if (token) {
      verifyMutation(token, {
        onSuccess: () => {
          toast.success("Email verified! You can now login.");
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
            toast.error(
              String(err?.response?.data?.message) || "Invalid or expired link."
            );
          } else {
            toast.error("Invalid or expired link.");
          }
        },
      });
    } else {
      navigate("/login");
    }
  }, [token, verified, error, navigate, verifyMutation]);

  return (
    <>
      {isPending ? (
        <div className="w-full max-w-md shadow-lg border-0 flex items-center gap-2 ">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p>Verifying your email...</p>
        </div>
      ) : isError ? (
        <div className="flex items-center gap-2 text-destructive">
          <XCircle className="h-5 w-5" />
          <p>Invalid or expired link</p>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle2 className="h-5 w-5" />
          <p>Verification complete</p>
        </div>
      )}
    </>
  );
}
