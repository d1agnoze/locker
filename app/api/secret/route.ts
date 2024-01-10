import Supabase from "@/utils/supabase/getSupabase"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const { data, error } = await Supabase().from('secrets').select(`
        id, 
        key, 
        value,
        title
        `)
    if (error) {
        return new Response('Something went wrong', { status: 400 })
    }
    return NextResponse.json({ data },{status:200})
}
// export const POST = async () => {
  
// }