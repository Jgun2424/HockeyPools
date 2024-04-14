import React from 'react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {Separator} from "@/components/ui/separator"
import {Badge} from "@/components/ui/badge"
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { UserAuth } from '@/app/firebase/AuthContext'

export default function PoolMembers(MemberInfo: any) {

  const { user } = UserAuth()

  const router = useRouter()

  console.log(MemberInfo)

  const handleMemberClick = () => {
    if (MemberInfo?.poolOwner === user?.uid) {
      return router.push(`/player?player_id=${MemberInfo.uid}&pool_id=${MemberInfo.poolId}`)
    } else {
      return toast.error('Only the pool owner can edit player settings')
    }
  }

  return (
    <>
    <Separator className='mb-1 mt-1'/>
    <div className='flex flex-col justify-between items-start w-full rounded-sm p-2 hover:bg-primary-foreground cursor-pointer ' key={MemberInfo.uid} onClick={() => handleMemberClick()}>
        <div className='flex flex-row gap-2 items-center'>
        <Avatar>
          <AvatarFallback>{MemberInfo.username.charAt(0).toUpperCase()}{MemberInfo.username.charAt(1).toUpperCase()}</AvatarFallback>
        </Avatar>

          <h1 className='text-base flex items-center gap-2'>{MemberInfo.username} {MemberInfo?.poolOwner === MemberInfo?.uid ? <Badge variant='secondary'>Owner</Badge> : null}</h1>
        </div>
  </div>
  </>
  )
}
