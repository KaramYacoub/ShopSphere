import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Loader from "./components/ui/loader";
import { Toaster } from "@/components/ui/sonner";

import { useCheckAuth } from "./hooks/useAuth";
import Layout from "./layout/layout";
import { ThemeProvider } from "./context/theme-provider.tsx";

export default function App() {
  const { isAuthenticated, isPending } = useCheckAuth();

  if (isPending) return <Loader />;

  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Layout>
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
            <Route path="/" element={<Home />} />
          </Routes>
        </Layout>
        <Toaster richColors closeButton toastOptions={{ duration: 3000 }} />
      </ThemeProvider>
    </BrowserRouter>
  );
}
