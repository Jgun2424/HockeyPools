'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import Link from 'next/link'
import { MoonIcon, SunIcon } from 'lucide-react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Badge } from "@/components/ui/badge"
import { UserAuth } from '../app/firebase/AuthContext'

export default function Nav() {
    const { user, logOut } = UserAuth()
    const { setTheme } = useTheme()
  return (
    <div className='flex flex-row gap-1 w-full max-w-screen-2xl m-auto p-5 justify-between items-center'>
        <div className='flex flex-row gap-2'>
            <Link href='/'>
                <h1 className='font-bold tracking-tighter text-2xl'>Playoff Pool</h1>
            </Link>
            <Badge variant="default" className='tracking-tight'>BETA v1.0</Badge>
        </div>
        
        {/* account area */}
        <div className='flex flex-row gap-2'>
            {
                user ? (
                    <Button variant='default' onClick={logOut}>My Account</Button>
                ) : (
                    <>
                    <Link href='/login'>
                        <Button variant='default'>Login</Button>
                    </Link>
                    <Link href='/signup'>
                        <Button variant='secondary'>Sign Up</Button>
                    </Link>
                    </>
                )
            }

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                    <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </div>
  )
}
