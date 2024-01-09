"use client"
import Secret from "@/models/secret";
import { Input } from "./ui/input";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const SecretInput = ({ secret, refKey, refValue }: { secret: Secret, refKey: any, refValue: any }) => {
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev)
    }
    return (<div className="flex w-full items-center px-2 border border-slate-600 rounded-xl">
        <Input type="text" className="w-1/2 border-none focus:border-b-primary" {...refKey}/>
        <div className="relative w-1/2">
            <Input type={showPassword ? 'text' : 'password'} className=" border-none" {...refValue} />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer">
                {showPassword ? (
                    <EyeOff className="h-6 w-6" onClick={togglePasswordVisibility} />
                ) : (
                    <Eye className="h-6 w-6" onClick={togglePasswordVisibility} />
                )}
            </div>
        </div>
    </div>);
}

export default SecretInput;