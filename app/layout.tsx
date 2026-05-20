import "./globals.css";
import type { Metadata } from "next";
import { ScrollRevealProvider } from "../components/scroll-reveal-provider";
import { BackToTop } from "../components/back-to-top";

export const metadata: Metadata = {
  title: "WorldFigures",
  description:
    "See how the world views public figures through sourced signals like polling, sentiment, trust, impact, and controversy.",
  icons: {
    icon: [
      { url: "/images/icon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/images/icon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/icon/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/images/icon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/images/icon/site.webmanifest",
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ScrollRevealProvider />
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
