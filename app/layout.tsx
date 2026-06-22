import type { Metadata } from "next";
import { Space_Mono, IBM_Plex_Mono, Poppins } from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider } from "@/context/theme";
import CustomCursor from "@/components/CustomCursor";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300"],
  variable: "--font-poppins",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

const playfair = localFont({
  src: [
    { path: "../public/fonts/PlayfairDisplay-Regular.woff2",   weight: "400", style: "normal" },
    { path: "../public/fonts/PlayfairDisplay-Italic.woff2",    weight: "400", style: "italic" },
    { path: "../public/fonts/PlayfairDisplay-Medium.woff2",    weight: "500", style: "normal" },
    { path: "../public/fonts/PlayfairDisplay-SemiBold.woff2",  weight: "600", style: "normal" },
    { path: "../public/fonts/PlayfairDisplay-Bold.woff2",      weight: "700", style: "normal" },
    { path: "../public/fonts/PlayfairDisplay-BoldItalic.woff2",weight: "700", style: "italic" },
  ],
  variable: "--font-playfair",
  display: "swap",
});

const BASE_URL = "https://sebastiancalle.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Sebastian Calle — Photographer & Retoucher",
    template: "%s | Sebastian Calle",
  },
  description:
    "Sebastian Calle is a fashion, portrait, and editorial photographer and retoucher based in Barcelona. Explore his photography and retouching portfolio.",
  keywords: [
    "Sebastian Calle",
    "Sebastian Calle photographer",
    "Sebastian Calle retoucher",
    "fashion photographer Barcelona",
    "photographer Buenos Aires",
    "editorial photographer Spain",
    "portrait photographer Barcelona",
    "fashion photography portfolio",
    "retouching portfolio",
    "fotografo de moda Barcelona",
    "fotografo Buenos Aires",
  ],
  authors: [{ name: "Sebastian Calle", url: BASE_URL }],
  creator: "Sebastian Calle",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Sebastian Calle Photography",
    title: "Sebastian Calle — Photography & Retouching",
    description:
      "Professional photography and retouching portfolio by Sebastian Calle. Fashion, portrait, and editorial photography.",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Sebastian Calle Photography" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sebastian Calle — Photography & Retouching",
    description:
      "Professional photography and retouching portfolio by Sebastian Calle. Fashion, portrait, and editorial photography.",
    images: ["/og-default.png"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Sebastian Calle",
    url: BASE_URL,
    jobTitle: "Photographer & Retoucher",
    image: `${BASE_URL}/og-default.png`,
    sameAs: [
      "https://www.instagram.com/ssebastiancalle/",
    ],
  };

  return (
    <html lang="en" className={`${spaceMono.variable} ${ibmPlexMono.variable} ${playfair.variable} ${poppins.variable}`}>
      <head>
        <link rel="preconnect" href="https://hmcrootsgfjqvlvdepnp.supabase.co" />
        <link rel="dns-prefetch" href="https://hmcrootsgfjqvlvdepnp.supabase.co" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="bg-black text-white antialiased" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
        <ThemeProvider>
          <CustomCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
