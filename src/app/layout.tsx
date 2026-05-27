import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Adverstory",
  description: "AI-powered ad creation",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.className}>
      <body className="bg-gray-50 min-h-screen">
        <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <Link href="/create" className="text-xl font-bold text-blue-600 tracking-tight">
            Adverstory
          </Link>
          <Link
            href="/profile"
            className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            Edit Profile
          </Link>
        </nav>
        <main className="max-w-3xl mx-auto px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
