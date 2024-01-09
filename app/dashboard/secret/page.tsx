import Secrets from '@/components/Secrets';
import { AuthState } from '@/utils/supabase/auth_checker';
import { redirect } from 'next/navigation';
const Page = async () => {
   const uid = await AuthState()
    if (!uid) {
        redirect('/login')
    }
    return (<div className="">
        <h1 className="text-xl font-semibold">Secrets</h1>
        <blockquote className="my-4 lg:text-sm">
            <q>Three may keep a secret, if two of them are dead.</q>
            <address className="text-primary">Benjamin Franklin, Poor Richard's Almanack</address>
        </blockquote>
        <div className="flex flex-col w-full border-opacity-50">
            <div className="divider">Your secret lies here</div>
            <div className="grid card p-3 bg-base-300 rounded-box">
                <Secrets/>
            </div>
        </div>
    </div>);
}

export default Page;