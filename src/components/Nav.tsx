'use client'

import React, {useEffect, useState} from 'react'
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, MoonIcon, SunIcon, User, HomeIcon } from 'lucide-react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuGroup, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu'
import { Badge } from "@/components/ui/badge"
import { UserAuth } from '../app/firebase/AuthContext'
import { Avatar, AvatarFallback } from './ui/avatar'


export default function Nav() {
    const { user, logOut, loading } = UserAuth()
    const [clientLoading, setClientLoadfing] = useState(true)
    const router = useRouter()
    const { setTheme } = useTheme()

    useEffect(() => {
        if (loading === false) {
            setClientLoadfing(false)
        }
    }, [loading])

    const handleLogout = async () => {
        router.push('/')
        await logOut()
    }


  return (
    <div className='flex flex-row gap-1 w-full max-w-screen-2xl m-auto p-5 justify-between items-center'>
        <div className='flex flex-row gap-2'>
            <Link href='/'>
                <h1 className='font-bold tracking-tighter text-2xl'>Playoff Pool</h1>
            </Link>
            <Badge variant="default" className='tracking-tight'>BETA v1.0</Badge>
        </div>
        
        {/* account area */}
        <div className='flex flex-row gap-2 items-center'>
            {
                user ? (
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <div className='flex flex-row gap-2 items-center hover:bg-primary-foreground p-1 rounded-sm hover:cursor-pointer'>
                            <Avatar>
                                <AvatarFallback>{clientLoading ? null : user?.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <h1 className='text-base'>{clientLoading ? null : user?.displayName}</h1>
                    </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                                <Link href='/profile' className='flex flex-row items-center hover:bg-muted'>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleLogout()}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log Out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
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
