import type { Metadata } from "next";
import "./globals.css";
import LayoutProvider from "@/layout-provider";
import { Toaster } from "react-hot-toast";
export const metadata: Metadata = {
  title: "Quick Pick salon Finder",
  description: "A simple salon finder in your area",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LayoutProvider>{children}</LayoutProvider>
        <Toaster />
      </body>
    </html>
  );
}
