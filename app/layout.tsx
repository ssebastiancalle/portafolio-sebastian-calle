import type { Metadata } from "next";
import { Space_Mono, IBM_Plex_Mono } from "next/font/google";
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
    <html lang="en" className={`${spaceMono.variable} ${ibmPlexMono.variable}`}>
      <body className="bg-black text-white font-mono antialiased">
        <ThemeProvider>
          <CustomCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
