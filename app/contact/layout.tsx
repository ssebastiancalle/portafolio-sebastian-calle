import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book Sebastian Calle for fashion, portrait, or editorial photography and retouching. Available for sessions in Barcelona, Spain, and international assignments.",
  openGraph: {
    title: "Book a Session | Sebastian Calle",
    description:
      "Book Sebastian Calle for fashion, portrait, or editorial photography and retouching. Available for sessions in Barcelona, Spain, and international assignments.",
    url: "https://sebastiancalle.com/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
