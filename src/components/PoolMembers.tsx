import React from 'react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {Separator} from "@/components/ui/separator"

export default function PoolMembers(MemberInfo: any) {

  return (
  <div className='flex flex-col justify-between items-start w-full rounded-sm ' key={MemberInfo.uid}>
        <Separator className='mb-3 mt-1'/>
        <div className='flex flex-row gap-2 items-center'>
        <Avatar>
          <AvatarFallback>{MemberInfo.username.charAt(0).toUpperCase()}{MemberInfo.username.charAt(1).toUpperCase()}</AvatarFallback>
        </Avatar>

          <h1 className='text-base'>{MemberInfo.username}</h1>
        </div>
  </div>
  )
}
