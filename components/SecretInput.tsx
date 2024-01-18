"use client"
import Secret from "@/models/secret";
import { Input } from "./ui/input";
import { useState } from "react";
import { Copy, Eye, EyeOff } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { toast } from "react-toastify";

const SecretInput = ({ secret, refKey, refValue }: { secret: Secret, refKey: any, refValue: any }) => {
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev)
    }
    const copyToClipboard = () => {
        if (!navigator.clipboard) {
            toast.warn('Clipboard fucntion is not available')
        }
      navigator.clipboard.writeText(secret.value)
    }
    return (
            <div className="flex w-full items-center px-2 border border-slate-600 rounded-xl">
                <Input type="text" className="w-1/2 border-none focus:border-b-primary" {...refKey} />
                <div className="relative w-1/2">
                    <Input type={showPassword ? 'text' : 'password'} className=" border-none" {...refValue} />
                    <div className="absolute inset-y-0 right-0 max-sm:pr-1 md:pr-3 flex items-center text-gray-400 cursor-pointer">
                        <Copy className="h-6 w-6 md:max-lg:mx-3 sm:mx-1" onClick={copyToClipboard}/>
                        {showPassword ? (
                            <EyeOff className="h-6 w-6" onClick={togglePasswordVisibility} />
                        ) : (
                            <Eye className="h-6 w-6" onClick={togglePasswordVisibility} />
                        )}
                    </div>
                    <div className="absolute inset-y-0 left-0 pr-3 flex items-center text-gray-400 cursor-pointer">
                    </div>
                </div>
            </div>
    );
}

export default SecretInput;