import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useCheckAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import {
  useAllCategories,
  useRandomThreeFeatureProducts,
} from "@/hooks/useProducts";
import ProductCard from "@/components/productCard";
import type { Category, ProductCardProps } from "@/types/types";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { isAuthenticated } = useCheckAuth();
  const { data } = useRandomThreeFeatureProducts();
  const { t } = useTranslation();

  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  // Categories data
  const categories = useAllCategories().data?.categories || [];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section
        className="relative w-full min-h-screen flex flex-col items-center justify-center text-center bg-cover bg-center"
        style={{
          backgroundImage: "url(/logo.png)",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <motion.div
          className="relative z-10 max-w-2xl px-4 text-white"
          initial={{ opacity: 0, y: -150 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold">
            {t("Welcome")} ShopSphere
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-200">
            {t("Discover")}
          </p>
          {!isAuthenticated ? (
            <div className="mt-6 flex gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="text-secondary bg-primary">
                  {t("GetStarted")}
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-primary border-primary hover:bg-primary hover:text-white"
                >
                  {t("Login")}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="mt-6 flex gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" className="text-secondary bg-primary">
                  {t("Shop_now")}
                </Button>
              </Link>
            </div>
          )}
        </motion.div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-4 md:px-12 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4"
              variants={fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {t("FeaturedTitle")}
            </motion.h2>
            <motion.p
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              variants={fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {t("FeaturedDescription")}
            </motion.p>
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {data?.randomProducts?.map(
              (product: ProductCardProps["product"], index: number) => (
                <ProductCard
                  key={index}
                  product={product}
                  isAuthenticated={isAuthenticated}
                />
              )
            )}
          </motion.div>

          <div className="text-center mt-8">
            <Link to="/products">
              <Button size="lg" variant="outline">
                {t("ShowAll")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 md:px-12 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4"
              variants={fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {t("CategoriesTitle")}
            </motion.h2>
            <motion.p
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              variants={fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {t("CategoriesDescription")}
            </motion.p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {categories.map((category: Category) => (
              <Link
                key={category._id}
                to={`/products?category=${category.name}`}
              >
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-white dark:bg-gray-800">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl">{category.name}</CardTitle>
                    <p className="text-muted-foreground text-sm">
                      {category.description}
                    </p>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
