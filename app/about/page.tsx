import type { Metadata } from "next";
import AboutContent from "@/components/AboutContent";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const metadata: Metadata = {
  title: "About Sebastian Calle",
  description:
    "Sebastian Calle is a fashion and editorial photographer and retoucher born in Buenos Aires, based in Barcelona. Known for bold contrasts, deep shadows, and cinematic portraits.",
  openGraph: {
    title: "About Sebastian Calle | Photographer & Retoucher",
    description:
      "Sebastian Calle is a fashion and editorial photographer and retoucher born in Buenos Aires, based in Barcelona. Known for bold contrasts, deep shadows, and cinematic portraits.",
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
