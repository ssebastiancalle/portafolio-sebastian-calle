import AboutContent from "@/components/AboutContent";
import { supabaseAdmin } from "@/lib/supabase-admin";

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
