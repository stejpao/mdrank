import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { Header } from "@/components/Header";
import { GA_CONSENT_BOOTSTRAP } from "@/lib/analytics";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mdrank.org"),
  title: {
    default: "MDRank — Medical devices, ranked by evidence",
    template: "%s | MDRank",
  },
  description:
    "Exact-model medical-device evidence with visible Evidence Confidence. MDRank Score and category rank appear for scored-eligible rows. Incomplete exact-model evidence stays unranked.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: GA_CONSENT_BOOTSTRAP }}
          id="mdrank-ga4-consent"
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
