import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import AppShell from "./ui";

export default async function AppPage() {
  const supabase = await supabaseServer();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/login");
  }

  return <AppShell email={data.user.email ?? ""} />;
}
