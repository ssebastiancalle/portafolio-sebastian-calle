import type { Metadata } from "next";
import { Space_Mono, IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider } from "@/context/theme";
import CustomCursor from "@/components/CustomCursor";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Sebastian Calle — Photography",
  description: "Capturing stories through light. Professional photography portfolio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceMono.variable} ${ibmPlexMono.variable} ${playfair.variable}`}>
      <body className="bg-black text-white antialiased" style={{ fontFamily: "var(--font-playfair), serif" }}>
        <ThemeProvider>
          <CustomCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
