import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Sidebar } from "../components/Sidebar";
import { TRPCProvider } from "../trpc/client";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import { AuthenticatedLayout } from "../layouts/AuthenticatedLayout";
import { Toaster } from "../components/ui/toaster";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "RepnAI",
  description: "Platform for AI Voice Agents",
  icons: {
    icon: "/favicon/favicon.ico",
    apple: "/favicon/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          id="root"
          className={`${geistSans.variable} ${geistMono.variable} antialiased `}
        >
          <TRPCProvider>
            <SignedIn>
              <AuthenticatedLayout>{children}</AuthenticatedLayout>
            </SignedIn>
            <SignedOut>
              <UnAuthenticatedLayout>{children}</UnAuthenticatedLayout>
            </SignedOut>
          </TRPCProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}

const UnAuthenticatedLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <main className="flex h-screen bg-black text-white justify-center items-center">
      {children}
    </main>
  );
};
