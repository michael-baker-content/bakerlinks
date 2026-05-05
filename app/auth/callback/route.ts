import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/dashboard'

    if (code) {
        const supabase = await createClient()
        const { data } = await supabase.auth.exchangeCodeForSession(code)

        // If this is a new user confirming for the first time, add welcome flag
        const isNewUser = data?.user?.created_at &&
            Date.now() - new Date(data.user.created_at).getTime() < 10 * 60 * 1000

        if (isNewUser) {
            return NextResponse.redirect(`${origin}/dashboard?welcome=true`)
        }
    }

    return NextResponse.redirect(`${origin}${next}`)
}