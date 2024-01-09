import DeployButton from '@/components/DeployButton'
import AuthButton from '@/components/AuthButton'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { drawer_map } from './../../utils/drawer/map';
import { CookiesProvider } from 'next-client-cookies/server';

export default function DashboardLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {
    const cookieStore = cookies()

    const canInitSupabaseClient = () => {
        try {
            createClient(cookieStore)
            return true
        } catch (e) {
            return false
        }
    }

    const isSupabaseConnected = canInitSupabaseClient()

    return (
        <section className="flex-1 w-full flex flex-col gap-20 items-center">
            <div className="drawer lg:drawer-open">
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    <nav className="w-full flex justify-center navbar bg-base-100">
                        <div className="flex-none">
                            <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost lg:hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                            </label>
                        </div>
                        <div className="flex-1">
                            <Link className="btn btn-ghost text-xl" href={'/'}>🔐Locker</Link>
                        </div>
                        <div className="flex-none">
                            {isSupabaseConnected && <AuthButton />}
                        </div>
                    </nav>
                    <div className="lg:px-14 max-md:px-5 py-6">
                        <CookiesProvider>
                            {children}
                        </CookiesProvider>
                    </div>
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content lg:pt-12 sm:max-md:pt-4">
                        <div className="flex flex-col items-start lg:pl-4 mb-2 gap-2 sm:max-md:hidden">
                            <img src="https://i.pinimg.com/originals/9a/3c/3f/9a3c3fb5f73822af8514df07f6676392.gif" className="rounded-full lg:w-28 h-28 object-cover" alt="" />
                            <h1 className='text-2xl font-bold'>Feature 🌼</h1>
                        </div>
                        {drawer_map.map((item, index) => (
                            <li key={index}><Link href={item.link}>{item.display_text}</Link></li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
}