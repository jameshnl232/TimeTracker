import type { Metadata } from "next";
import "./globals.css";
import { Roboto } from "next/font/google";
import StoreProvider from "./components/StoreProvider";
import { Toaster } from "@/components/ui/toaster";


const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Belzir Time Tracker",
  description: "Simple time tracking application for companies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`min-h-screen ${roboto.className} antialiased`}>
        <StoreProvider>
          {children}
          <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}
