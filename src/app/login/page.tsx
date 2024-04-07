'use client'

import React, {useRef, useState} from 'react'
import { UserAuth } from '../firebase/AuthContext';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import Link from 'next/link';


export default function page() {
const router = useRouter()
const [submitted, setSubmitted] = useState(false);
const EmailRef = useRef<HTMLInputElement>(null);
const passwordRef = useRef<HTMLInputElement>(null);
const { user, Login } = UserAuth();
console.log(user)

const handleLogin = async () => {
    setSubmitted(true)
    const email = EmailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password) {
        setSubmitted(false)
        console.log('Please fill in all fields')
        toast.warning('Please fill in all fields')
        return;
    }


    const loginResponse = await Login(email, password);

    console.log(loginResponse)

    if (loginResponse.success === true) {
        setSubmitted(true)
        toast.success('Logged in successfully!')
        router.push('/')
    } else {
        setSubmitted(false)
        toast.error(loginResponse.error.replace('Firebase:', ''))
    }

}

  return (
    <div className="flex flex-col gap-1 w-full max-w-screen-2xl m-auto p-5 justify-between pt-0">
        <div className='grid grid-cols-2 h-[89vh]'>
            <div className="bg-secondary rounded-l-lg flex flex-col p-10 gap-2 justify-center shadow-inner">
                <h1 className="text-5xl text-primary font-bold tracking-tighter text-center">Welcome Back!</h1>
                <p className="tracking-tight text-center">Log back into your account to access or create a new pool!</p>
                
                <div className='flex flex-col gap-2 mt-3 items-center'>
                    <Input type="email" placeholder="Email" className='w-[90%]' ref={EmailRef}/>
                    <Input type="password" placeholder="Password" className='w-[90%]' ref={passwordRef}/>
                    <div className='w-full flex flex-col items-center gap-2'>
                        <Button onClick={() => handleLogin()} variant="default" className='w-[90%]' disabled={submitted}>Login</Button>
                        <p>or</p>
                        <Button variant="outline" className='w-[90%]' asChild>
                            <Link href='/signup'>Create Account</Link>
                        </Button>
                    </div>
                    <div className='text-center'>
                        <p className='text-xs'>Developed and managed by <a href="https://www.luxelite.ca" className="text-primary font-bold">Luxelite.ca</a></p>
                        <p className='text-xs'> by signing in you agree to our <a href="#" className="text-primary font-bold">Terms of Service</a> and <a href="#" className="text-primary font-bold">Privacy Policy</a></p>
                    </div>
                </div>

            </div>
            <img src="https://images2.alphacoders.com/134/1347318.png" alt="" className=" rounded-r-lg h-full object-cover shadow-inner "/>
        </div>
    </div>
  )
}
