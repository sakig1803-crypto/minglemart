import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "MingleMart",
  description: "Creator x Brand Marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <Navbar />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#111827",
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.1)",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}