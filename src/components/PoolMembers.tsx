import React from 'react'

export default function PoolMembers(MemberInfo: any) {
  return (
  <div className='flex flex-row justify-between items-center w-full bg-background p-3 rounded-sm' key={MemberInfo.uid}>
        <p>{MemberInfo.username}</p>
  </div>
  )
}
