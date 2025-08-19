import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Shield, Star, Heart, Code } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function About() {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();

  const fadeUp = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1 },
  };

  const rtl = {
    initial: { opacity: 0, x: 150 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 1 },
  };

  const ltr = {
    initial: { opacity: 0, x: -150 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 1 },
  };

  return (
    <div className="flex flex-col min-h-screen" dir={dir}>
      {/* Hero Section */}
      <section className="relative w-full py-20 flex flex-col items-center justify-center text-center bg-gradient-to-br from-primary/10 to-secondary/10">
        <motion.div
          className="max-w-4xl px-4"
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t("about.title")} <span className="text-primary">ShopSphere</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("about.hero.description")}
          </p>
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 md:px-12">
        <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2">
          <motion.div
            variants={ltr}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Heart className="h-6 w-6 text-primary" />
                  {t("about.mission.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {t("about.mission.description")}
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
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Star className="h-6 w-6 text-secondary" />
                  {t("about.vision.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {t("about.vision.description")}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 md:px-12 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("about.values.title")}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <motion.div
              variants={fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{t("about.values.trust.title")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t("about.values.trust.description")}
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
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                    <Code className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle>{t("about.values.innovation.title")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t("about.values.innovation.description")}
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
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{t("about.values.customer.title")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t("about.values.customer.description")}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Creator Section */}
      <section className="py-16 px-4 md:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("about.creator.title")}
          </h2>
          <div className="grid gap-8 md:grid-cols-2 items-center">
            {/* Photo Side */}
            <motion.div
              className="flex justify-center"
              variants={ltr}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <div className="w-80 h-80 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-6xl font-bold shadow-2xl">
                K
              </div>
            </motion.div>

            {/* Content Side */}
            <motion.div
              className="space-y-6"
              variants={rtl}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <div>
                <h3 className="text-3xl font-bold mb-2">
                  {t("about.creator.name")}
                </h3>
                <p className="text-primary font-medium text-xl">
                  {t("about.creator.role")}
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {t("about.creator.description.main")}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t("about.creator.description.skills")}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4 md:px-12 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">{t("about.story.title")}</h2>
          <motion.div
            className="space-y-6 text-lg text-muted-foreground leading-relaxed"
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <p>{t("about.story.paragraph1")}</p>
            <p>{t("about.story.paragraph2")}</p>
            <p>{t("about.story.paragraph3")}</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
