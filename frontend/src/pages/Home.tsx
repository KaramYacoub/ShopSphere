import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HomeIcon,
  Heart,
  Dumbbell,
  Smartphone,
  Car,
  BookOpen,
} from "lucide-react";
import { useCheckAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { useRandomThreeFeatureProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/productCard";
import type { ProductCardProps } from "@/types/product";

export default function Home() {
  const { isAuthenticated } = useCheckAuth();
  const { data } = useRandomThreeFeatureProducts();

  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  // Categories data
  const categories = [
    {
      id: 1,
      name: "Electronics",
      icon: Smartphone,
      description: "Latest gadgets and tech",
      color: "from-blue-500 to-cyan-500",
      count: "150+ Products",
    },
    {
      id: 2,
      name: "Home & Garden",
      icon: HomeIcon,
      description: "Everything for your home",
      color: "from-green-500 to-emerald-500",
      count: "200+ Products",
    },
    {
      id: 3,
      name: "Fashion",
      icon: Heart,
      description: "Style and accessories",
      color: "from-pink-500 to-rose-500",
      count: "300+ Products",
    },
    {
      id: 4,
      name: "Sports & Fitness",
      icon: Dumbbell,
      description: "Active lifestyle gear",
      color: "from-orange-500 to-red-500",
      count: "120+ Products",
    },
    {
      id: 5,
      name: "Automotive",
      icon: Car,
      description: "Car accessories & tools",
      color: "from-gray-500 to-slate-500",
      count: "80+ Products",
    },
    {
      id: 6,
      name: "Books & Media",
      icon: BookOpen,
      description: "Knowledge and entertainment",
      color: "from-purple-500 to-violet-500",
      count: "250+ Products",
    },
  ];

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
            Welcome to ShopSphere
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-200">
            Discover the latest gadgets, electronics, and more.
          </p>
          <div className="mt-6 flex gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="text-secondary bg-primary">
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="text-primary border-primary hover:bg-primary hover:text-white"
              >
                Login
              </Button>
            </Link>
          </div>
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
              Featured Products
            </motion.h2>
            <motion.p
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              variants={fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              Discover our most popular and highly-rated products
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
              (product: ProductCardProps, index: number) => (
                <ProductCard
                  key={index}
                  _id={product._id}
                  image={product.image}
                  name={product.name}
                  onSale={product.onSale}
                  rating={product.rating}
                  numReviews={product.numReviews}
                  discountPrice={product.discountPrice}
                  price={product.price}
                  stock={product.stock}
                  category={product.category}
                  createdAt={product.createdAt}
                  isAuthenticated={isAuthenticated}
                />
              )
            )}
          </motion.div>

          <div className="text-center mt-8">
            <Link to="/products">
              <Button size="lg" variant="outline">
                View All Products
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
              Shop by Category
            </motion.h2>
            <motion.p
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              variants={fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              Explore our wide range of products organized by category. Find
              exactly what you're looking for.
            </motion.p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {categories.map((category) => (
              <Link key={category.id} to={`/category/${category.id}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-white dark:bg-gray-800">
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`mx-auto w-16 h-16 bg-gradient-to-br ${category.color} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <category.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{category.name}</CardTitle>
                    <p className="text-muted-foreground text-sm">
                      {category.description}
                    </p>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                      {category.count}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-muted flex flex-col items-center text-center">
        <motion.h3
          className="text-2xl font-bold"
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          Join ShopSphere Today
        </motion.h3>
        <motion.p
          className="mt-2 text-gray-600 dark:text-gray-400"
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          Create an account to unlock shopping, cart, and checkout features.
        </motion.p>
        <Link to="/signup">
          <Button size="lg" className="mt-6">
            Create Account
          </Button>
        </Link>
      </section>
    </div>
  );
}
