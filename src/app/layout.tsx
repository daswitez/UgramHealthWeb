import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../store/AuthContext";
import RootGuard from "../components/Navigation/RootGuard";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ugram Health | EMR Web",
  description: "FUSUM Administrative Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>
          <RootGuard>
            {children}
          </RootGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
