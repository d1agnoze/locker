"use server"
import { AuthState } from "@/utils/supabase/auth_checker";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const Page = async () => {
    redirect('/dashboard/secret')
    return (<></>);
}

export default Page;