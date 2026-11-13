import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const manrope = localFont({ src: "./fonts/ZincWiseSans.ttf", display: "swap" });
export const metadata: Metadata = { title: "ZincWise | Climate-Smart Agriculture", description: "Indicative wheat nutrition insights for Punjab." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={manrope.className}>{children}</body></html>;
}
