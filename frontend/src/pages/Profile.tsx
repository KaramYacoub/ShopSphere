import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Loader2,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Settings,
  Shield,
  ChevronRight,
  CheckCircle2,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import {
  useCheckAuth,
  useUpdateProfile,
  useDeleteAccount,
} from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import Loader from "@/components/ui/loader";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
});

const securitySchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => !!data.currentPassword || !!data.newPassword, {
    message: "Both fields are required",
  });

type ProfileData = z.infer<typeof profileSchema>;
type SecurityData = z.infer<typeof securitySchema>;

export default function Profile() {
  const { t } = useTranslation();
  const { user, isPending } = useCheckAuth();
  const { updateProfileMutation, isPending: isUpdatePending } =
    useUpdateProfile();
  const { deleteAccountMutation, isPending: isDeletePending } =
    useDeleteAccount();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const {
    register: registerSecurity,
    handleSubmit: handleSecuritySubmit,
    formState: { errors: securityErrors },
    reset: resetSecurity,
  } = useForm<SecurityData>({
    resolver: zodResolver(securitySchema),
  });

  const onProfileSubmit = (data: ProfileData) => {
    updateProfileMutation(
      { name: data.name, email: data.email },
      {
        onSuccess: () => {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        },
      }
    );
  };

  const onSecuritySubmit = (data: SecurityData) => {
    updateProfileMutation(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
          resetSecurity();
        },
      }
    );
  };

  const handleDeleteAccount = () => {
    deleteAccountMutation(undefined, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        // User will be redirected by the hook or authentication system
      },
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  };

  if (isPending) return <Loader />;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="md:col-span-1">
          <Card className="shadow-md border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/20 p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-secondary-foreground shadow-md">
                  <AvatarFallback className="bg-primary text-secondary font-semibold">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-bold text-lg">{user?.name}</h2>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1 py-4">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:cursor-pointer ${
                    activeTab === "profile"
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4" />
                    <span>{t("Profile")}</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:cursor-pointer ${
                    activeTab === "security"
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4" />
                    <span>{t("Security")}</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card className="shadow-md border-0 mt-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {t("Account_Status")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">{t("Email_Verified")}</span>
                  <Badge variant={user?.isVerified ? "default" : "destructive"}>
                    {user?.isVerified ? t("Verified") : t("Pending")}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">{t("Account_Active")}</span>
                  <Badge variant="default">{t("Active")}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">{t("Member_Since")}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(user?.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">{t("Last_Updated")}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(user?.updatedAt)}
                  </span>
                </div>

                {/* Delete Account Button */}
                <Separator className="my-4" />
                <AlertDialog
                  open={showDeleteDialog}
                  onOpenChange={setShowDeleteDialog}
                >
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full mt-2">
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t("Delete_Account")}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        {t("Are_you_sure")}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {t("Delete_Account_Confirmation")}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        disabled={isDeletePending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isDeletePending ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {t("Deleting")}
                          </span>
                        ) : (
                          t("Delete_Account")
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="shadow-lg border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/20 p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-2xl font-bold">
                        {activeTab === "profile" && t("Profile_Information")}
                        {activeTab === "security" && t("Security_Settings")}
                      </CardTitle>
                      <CardDescription>
                        {activeTab === "profile" &&
                          t("Manage_your_profile_information")}
                        {activeTab === "security" &&
                          t("Update_your_password_and_security_settings")}
                      </CardDescription>
                    </div>

                    <AnimatePresence>
                      {showSuccess && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-2 rounded-md"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {t("Profile_updated_successfully")}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {activeTab === "profile" && (
                    <form
                      onSubmit={handleProfileSubmit(onProfileSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div>
                          <Label htmlFor="name" className="mb-2 block">
                            {t("Name")}
                          </Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="name"
                              type="text"
                              className="pl-9"
                              {...registerProfile("name")}
                            />
                          </div>
                          {profileErrors.name && (
                            <p className="text-red-500 text-sm mt-1">
                              {profileErrors.name.message}
                            </p>
                          )}
                        </div>

                        {/* Email */}
                        <div>
                          <Label htmlFor="email" className="mb-2 block">
                            {t("Email")}
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="email"
                              type="email"
                              className="pl-9"
                              {...registerProfile("email")}
                            />
                          </div>
                          {profileErrors.email && (
                            <p className="text-red-500 text-sm mt-1">
                              {profileErrors.email.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <Separator className="my-6" />

                      <div className="flex justify-end gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => resetProfile()}
                          disabled={isUpdatePending}
                        >
                          {t("Reset")}
                        </Button>
                        <Button
                          type="submit"
                          disabled={isUpdatePending}
                          className="min-w-32"
                        >
                          {isUpdatePending ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />{" "}
                              {t("Saving")}
                            </span>
                          ) : (
                            t("Save_Changes")
                          )}
                        </Button>
                      </div>
                    </form>
                  )}

                  {activeTab === "security" && (
                    <form
                      onSubmit={handleSecuritySubmit(onSecuritySubmit)}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 gap-6">
                        <div>
                          <Label
                            htmlFor="currentPassword"
                            className="mb-2 block"
                          >
                            {t("Current_Password")}
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="currentPassword"
                              type={showPassword ? "text" : "password"}
                              className="pl-9 pr-10"
                              {...registerSecurity("currentPassword")}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="newPassword" className="mb-2 block">
                            {t("New_Password")}
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="newPassword"
                              type={showPassword ? "text" : "password"}
                              className="pl-9 pr-10"
                              {...registerSecurity("newPassword")}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((prev) => !prev)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showPassword ? (
                                <Eye className="h-4 w-4" />
                              ) : (
                                <EyeOff className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                          {securityErrors.newPassword && (
                            <p className="text-red-500 text-sm mt-1">
                              {securityErrors.newPassword.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <Separator className="my-6" />

                      <div className="flex justify-end gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => resetSecurity()}
                          disabled={isUpdatePending}
                        >
                          {t("Reset")}
                        </Button>
                        <Button
                          type="submit"
                          disabled={isUpdatePending}
                          className="min-w-32"
                        >
                          {isUpdatePending ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />{" "}
                              {t("Saving")}
                            </span>
                          ) : (
                            t("Update_Password")
                          )}
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
