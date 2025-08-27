import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useCheckAuth, useContactUs } from "@/hooks/useAuth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();
  const { user, isAuthenticated } = useCheckAuth();
  const { contactUsMutation, isPending } = useContactUs();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: isAuthenticated ? user.name : "",
      email: isAuthenticated ? user.email : "",
      subject: "",
      message: "",
    },
  });

  const fadeUp = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const rtl = {
    initial: { opacity: 0, x: 150 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 },
  };

  const ltr = {
    initial: { opacity: 0, x: -150 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 },
  };

  const onSubmit = (data: ContactFormData) => {
    console.log(data);
    contactUsMutation(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <div className="flex flex-col min-h-screen" dir={dir}>
      {/* Hero Section */}
      <section className="relative w-full py-20 flex flex-col items-center justify-center text-center bg-gradient-to-br from-primary/10 to-secondary/10">
        <motion.div
          className="max-w-4xl px-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t("contact.hero.title")}{" "}
            <span className="text-primary">{t("contact.hero.highlight")}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("contact.hero.description")}
          </p>
        </motion.div>
      </section>

      {/* Contact Information */}
      <section className="py-16 px-4 md:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("contact.info.title")}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <motion.div
              variants={ltr}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">
                    {t("contact.info.email.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href="mailto:karamarandas03@gmail.com"
                    className="text-muted-foreground"
                  >
                    karamarandas03@gmail.com
                  </a>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={ltr}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">
                    {t("contact.info.phone.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <a href="tel:+962796414772" className="text-muted-foreground">
                    +962 796414772
                  </a>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={rtl}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">
                    {t("contact.info.address.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t("contact.info.address.city")},{" "}
                    {t("contact.info.address.country")}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={rtl}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">
                    {t("contact.info.hours.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t("contact.info.hours.days")}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-4 md:px-12 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {t("contact.form.title")}
            </h2>
            <p className="text-muted-foreground">
              {t("contact.form.description")}
            </p>
          </div>

          {isPending ? (
            <Card className="text-center py-12">
              <CardContent className="space-y-4">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                <h3 className="text-2xl font-bold text-green-600">
                  {t("contact.form.success.title")}
                </h3>
                <p className="text-muted-foreground">
                  {t("contact.form.success.message")}
                </p>
              </CardContent>
            </Card>
          ) : (
            <motion.div
              variants={fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    {t("contact.form.formTitle")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          {t("contact.form.name.label")}
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          disabled={isAuthenticated}
                          placeholder={t("contact.form.name.placeholder")}
                          {...register("name")}
                        />
                        {errors.name && (
                          <p className="text-sm text-red-500">
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">
                          {t("contact.form.email.label")}
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          disabled={isAuthenticated}
                          placeholder={t("contact.form.email.placeholder")}
                          {...register("email")}
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">
                        {t("contact.form.subject.label")}
                      </Label>
                      <Input
                        id="subject"
                        type="text"
                        placeholder={t("contact.form.subject.placeholder")}
                        {...register("subject")}
                      />
                      {errors.subject && (
                        <p className="text-sm text-red-500">
                          {errors.subject.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">
                        {t("contact.form.message.label")}
                      </Label>
                      <textarea
                        id="message"
                        placeholder={t("contact.form.message.placeholder")}
                        className="w-full min-h-[120px] px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...register("message")}
                      />
                      {errors.message && (
                        <p className="text-sm text-red-500">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full gap-2"
                      size="lg"
                      disabled={isPending}
                    >
                      {isPending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      {isPending
                        ? t("contact.form.submitting")
                        : t("contact.form.submit")}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 md:px-12 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("contact.faq.title")}
          </h2>
          <div className="space-y-6">
            <motion.div
              variants={fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {t("contact.faq.response.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t("contact.faq.response.answer")}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {t("contact.faq.hours.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t("contact.faq.hours.answer")}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {t("contact.faq.call.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t("contact.faq.call.answer")}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {t("contact.faq.support.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t("contact.faq.support.answer")}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
