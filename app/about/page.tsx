import type { Metadata } from "next";
import AboutContent from "@/components/AboutContent";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const metadata: Metadata = {
  title: "About",
  description:
    "Fashion, portrait, and editorial photographer born in Buenos Aires, based in Barcelona. Bold contrasts, deep shadows, cinematic strength.",
  openGraph: {
    title: "About | Sebastian Calle",
    description:
      "Fashion, portrait, and editorial photographer born in Buenos Aires, based in Barcelona. Bold contrasts, deep shadows, cinematic strength.",
    url: "https://sebastiancalle.com/about",
  },
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  let photoUrl: string | undefined;
  try {
    const { data } = await supabaseAdmin
      .from("site_settings")
      .select("value")
      .eq("key", "about_photo_url")
      .single();
    if (data?.value) photoUrl = data.value;
  } catch {
    // table may not exist yet, falls back to default in AboutContent
  }
  return <AboutContent photoUrl={photoUrl} />;
}
