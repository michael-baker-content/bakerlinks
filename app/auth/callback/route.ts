import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const type = searchParams.get('type')

    if (code) {
        const supabase = await createClient()
        await supabase.auth.exchangeCodeForSession(code)

        const { data: { user } } = await supabase.auth.getUser()
        const isNewUser = user?.created_at
            ? Date.now() - new Date(user.created_at).getTime() < 5 * 60 * 1000
            : false

        if (isNewUser) {
            return NextResponse.redirect(`${origin}/dashboard?welcome=true`)
        }
    }

    if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/auth/reset`)
    }

    return NextResponse.redirect(`${origin}/dashboard`)
}