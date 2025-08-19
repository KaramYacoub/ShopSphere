import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 to-gray-500 dark:from-gray-900 dark:to-gray-800">
      {/* Navbar is fixed at top */}
      <Navbar />

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
