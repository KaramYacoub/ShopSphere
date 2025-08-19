import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Heart,
  Code,
} from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();
  const dir = i18n.dir();

  const fadeUp = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <footer className="bg-background border-t" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Company Info */}
          <motion.div className="space-y-4" variants={fadeUp}>
            <div className="flex items-center space-x-2">
              <Code className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-primary">ShopSphere</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t("footer.company.description")}
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/karamarandas"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/karamarandas"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/karamarandas"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/karam-yacoub-65857a284"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div className="space-y-4" variants={fadeUp}>
            <h3 className="font-semibold text-lg">
              {t("footer.quickLinks.title")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {t("footer.quickLinks.home")}
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {t("footer.quickLinks.about")}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {t("footer.quickLinks.contact")}
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {t("footer.quickLinks.products")}
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div className="space-y-4" variants={fadeUp}>
            <h3 className="font-semibold text-lg">
              {t("footer.contact.title")}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary" />
                <a
                  href="mailto:karamarandas03@gmail.com"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  karamarandas03@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary" />
                <a
                  href="tel:+962796414772"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  +962 796414772
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground text-sm">
                  {t("footer.contact.address")}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Footer */}
        <motion.div
          className="border-t border-border pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>{t("footer.copyright", { year: currentYear })}</span>
            </div>

            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>{t("footer.madeWith")}</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>{t("footer.by")}</span>
              <span className="text-primary font-medium">
                {t("footer.creator")}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
