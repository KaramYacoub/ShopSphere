import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingBag,
  Star,
  HomeIcon,
  Heart,
  Dumbbell,
  Smartphone,
  Car,
  BookOpen,
} from "lucide-react";
import { useCheckAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

export default function Home() {
  const { isAuthenticated } = useCheckAuth();

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

  // Featured products data
  const featuredProducts = [
    {
      id: 1,
      name: "Wireless Noise-Cancelling Headphones",
      price: 199.99,
      originalPrice: 249.99,
      image: "/Noise Cancelling Headphones.jpeg",
      rating: 4.8,
      reviews: 1247,
      isNew: true,
      discount: 20,
    },
    {
      id: 2,
      name: "Smart Fitness Watch Pro",
      price: 299.99,
      originalPrice: 349.99,
      image: "/Fitness Tracker Watch.avif",
      rating: 4.9,
      reviews: 892,
      isNew: false,
      discount: 14,
    },
    {
      id: 3,
      name: "Portable Bluetooth Speaker",
      price: 89.99,
      originalPrice: 119.99,
      image: "/Portable Bluetooth Speaker.webp",
      rating: 4.7,
      reviews: 2156,
      isNew: false,
      discount: 25,
    },
    {
      id: 4,
      name: "Smart LED Light Bulb Set",
      price: 49.99,
      originalPrice: 79.99,
      image: "/Smart LED Light Bulb.webp",
      rating: 4.6,
      reviews: 743,
      isNew: true,
      discount: 38,
    },
    {
      id: 5,
      name: "Wireless Charging Pad",
      price: 34.99,
      originalPrice: 49.99,
      image: "/Wireless Charging Pad.webp",
      rating: 4.5,
      reviews: 1892,
      isNew: false,
      discount: 30,
    },
    {
      id: 6,
      name: "Electric Kettle with Temperature Control",
      price: 79.99,
      originalPrice: 99.99,
      image: "/Electric Kettle.jpeg",
      rating: 4.8,
      reviews: 567,
      isNew: true,
      discount: 20,
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

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
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <CardHeader className="p-0">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.isNew && (
                      <div className="absolute top-2 left-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500 text-white">
                        NEW
                      </div>
                    )}
                    {product.discount > 0 && (
                      <div className="absolute top-2 right-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
                        -{product.discount}%
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="mb-3">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center">
                        {renderStars(product.rating)}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({product.reviews})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-primary">
                        ${product.price}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    className="w-full gap-2"
                    disabled={!isAuthenticated}
                    onClick={() => {
                      if (isAuthenticated) {
                        console.log(`Added ${product.name} to cart`);
                      }
                    }}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    {isAuthenticated ? "Add to Cart" : "Login to Shop"}
                  </Button>
                </CardContent>
              </Card>
            ))}
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
