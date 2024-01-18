'use client'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const reset = async () => {
        const supabase = createClientComponentClient()
        const { data, error } = await supabase.auth
            .resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth/forgot` })
        if (error) {
            toast.warn('Something went wrong!')
        }
        else {
            toast.success('Reset email sent!')
        }

    }
    useEffect(() => {
        const supabase = createClientComponentClient()
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (session!=null && session.user!=null) {
                const newPassword = prompt("What would you like your new password to be?");
                if (newPassword) {
                    const { data, error } = await supabase.auth
                        .updateUser({ password: newPassword })
                    if (data) {
                        alert("Password updated successfully!")
                    }
                    if (error) alert("There was an error updating your password.")
                }
            }
        })
    }, [])
    return (<div className="min-h-screen w-screen flex items-center justify-center">
        <div className="flex flex-col gap-2 p-4 max-sm:w-full w-auto">
            <label htmlFor="email">Enter yo email</label>
            <input type="text" name="email" value={email} className="input input-bordered input-primary w-full" onChange={(event) => setEmail(event.target.value)} />
            <button className="btn btn-primary" onClick={() => reset()}>Hook me up!</button>
        </div>
    </div>);
}

export default ForgotPassword;