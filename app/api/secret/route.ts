import Supabase from "@/utils/supabase/getSupabase"

export async function GET(request: Request) {
    const { data, error } = await Supabase().from('secrets').select(`
        id, 
        key, 
        value
        `)
    if (error) {
        return new Response('Something went wrong', { status: 400 })
    }
    return Response.json({ data },{status:200})
}
// export const POST = async () => {
  
// }