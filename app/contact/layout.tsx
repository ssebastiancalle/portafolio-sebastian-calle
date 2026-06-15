import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Sebastian Calle for photography and retouching inquiries. Available for local and international assignments.",
  openGraph: {
    title: "Contact | Sebastian Calle",
    description:
      "Get in touch with Sebastian Calle for photography and retouching inquiries. Available for local and international assignments.",
    url: "https://sebastiancalle.com/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
