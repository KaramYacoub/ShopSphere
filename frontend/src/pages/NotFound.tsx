import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search, AlertCircle } from "lucide-react";
import type { Variants } from "framer-motion";

export default function NotFound() {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();

  const fadeUp: Variants = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const bounce: Variants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.8,
      },
    },
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center px-4"
      dir={dir}
    >
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 Number */}
        <motion.div
          className="mb-8"
          variants={bounce}
          initial="initial"
          animate="animate"
        >
          <h1 className="text-9xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            404
          </h1>
        </motion.div>

        {/* Message */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          className="mb-8"
        >
          <div className="flex justify-center mb-6">
            <AlertCircle className="h-12 w-12 text-yellow-500" />
          </div>
          <h2 className="text-3xl font-bold mb-4">{t("notFound.title")}</h2>
          <p className="text-muted-foreground text-lg mb-6">
            {t("notFound.description")}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
        >
          <Button asChild size="lg" className="gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              {t("notFound.actions.home")}
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link to="/products">
              <Search className="h-4 w-4" />
              {t("notFound.actions.browse")}
            </Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="gap-2">
            <Link to="#" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4" />
              {t("notFound.actions.back")}
            </Link>
          </Button>
        </motion.div>

        {/* Help Card */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-muted/50 border-border">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">{t("notFound.help.title")}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t("notFound.help.description")}
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button asChild variant="outline" size="sm">
                  <Link to="/contact">{t("notFound.help.contact")}</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link to="/about">{t("notFound.help.about")}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute bottom-8 left-8 opacity-10"
        initial={{ opacity: 0, rotate: -30 }}
        animate={{ opacity: 0.1, rotate: 0 }}
        transition={{ delay: 0.6, duration: 1 }}
      >
        <AlertCircle className="h-32 w-32 text-primary" />
      </motion.div>
      <motion.div
        className="absolute top-8 right-8 opacity-10"
        initial={{ opacity: 0, rotate: 30 }}
        animate={{ opacity: 0.1, rotate: 0 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        <Home className="h-24 w-24 text-secondary" />
      </motion.div>
    </div>
  );
}
