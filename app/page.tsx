import { AuthState } from "@/utils/supabase/auth_checker";
import { redirect } from "next/navigation";

export default async function Index() {
  return await AuthState() ? redirect('/dashboard') : redirect('/login')
}
