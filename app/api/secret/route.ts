import Secret from "@/models/secret"
import { encryptSecrets } from "@/utils/stringUtils"
import Supabase from "@/utils/supabase/getSupabase"
import { createRouteHandlerClient, createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
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
    const decrypt = encryptSecrets(data, 'de')
    return NextResponse.json({ decrypt }, { status: 200 })
}
export async function POST(request: Request) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const output: Secret[] = await request.json()
    const decrypted = encryptSecrets(output, 'en')
    const { error } = await supabase.from('secrets').upsert([...decrypted]).select()
    return error ?
        NextResponse.json({ message: 'Database communication error' }, { status: 400, statusText: 'POST request failed' })
        : NextResponse.json({ message: 'Secret(s) saved' }, { status: 200, statusText: 'POST request success' })

}