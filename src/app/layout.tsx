import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { OrderBar } from "@/components/order/order-bar";
import { OrderProvider } from "@/components/order/order-provider";
import { OrderSheet } from "@/components/order/order-sheet";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { menu } from "@/content/menu";
import { site } from "@/content/site";
import { validateContent } from "@/content/validate";
import { restaurantJsonLd } from "@/lib/structured-data";
import "./globals.css";

validateContent({ menu, hours: site.hours });

// Self-hosted by next/font at build time: no request to Google, no layout shift while fonts load.
// `subsets` only controls preloading. The Yoruba letters with dots below (Ẹ, ọ, ṣ) live in a smaller
// extra file that the browser fetches on its own, only on pages that use them.
const display = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} · ${site.tagline}`, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: site.name,
    title: `${site.name} · ${site.tagline}`,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#12100e",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-NG" className={`${display.variable} ${sans.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="eyebrow fixed top-3 left-3 z-50 -translate-y-20 rounded-full bg-ivory px-5 py-3 text-ink transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <OrderProvider>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <OrderBar />
          <OrderSheet />
        </OrderProvider>
        <script
          type="application/ld+json"
          // JSON-LD is how search engines learn our hours, address and cuisine. `<` is escaped so content can't close the tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd()).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
