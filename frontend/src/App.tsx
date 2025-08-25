import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Products from "./pages/Products";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation .tsx";
import ScrollToTop from "./components/ScrollToTop";
import Loader from "./components/ui/loader";
import { Toaster } from "@/components/ui/sonner";

import { useCheckAuth } from "./hooks/useAuth";
import Layout from "./layout/layout";
import { ThemeProvider } from "./context/theme-provider.tsx";
import Orders from "./pages/Orders.tsx";

export default function App() {
  const { isAuthenticated, isPending } = useCheckAuth();

  if (isPending) return <Loader />;

  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Layout>
          <ScrollToTop />
          <Routes>
            <Route
              path="/signup"
              element={!isAuthenticated ? <Signup /> : <Navigate to="/" />}
            />
            <Route
              path="/login"
              element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/verify-email"
              element={!isAuthenticated ? <VerifyEmail /> : <Navigate to="/" />}
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/checkout"
              element={isAuthenticated ? <Checkout /> : <Navigate to="/" />}
            />
            <Route
              path="/order-confirmation"
              element={
                isAuthenticated ? <OrderConfirmation /> : <Navigate to="/" />
              }
            />
            <Route
              path="/orders"
              element={isAuthenticated ? <Orders /> : <Navigate to="/" />}
            />
          </Routes>
        </Layout>
        <Toaster richColors closeButton toastOptions={{ duration: 3000 }} />
      </ThemeProvider>
    </BrowserRouter>
  );
}
