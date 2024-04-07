'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import { UserAuth } from '../firebase/AuthContext';


export default function page() {
  const searchParams = useSearchParams();
  const { getPoolData, userData, loading, user } = UserAuth();
  const router = useRouter();

  const [poolData, setPoolData] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [ClientLoading, setLoading] = useState(true);

  if (!searchParams.get('id')) {
    return (
      <div className='flex flex-col gap-1 w-full max-w-screen-2xl m-auto p-5 justify-between pt-0'>
        <h1>Invalid Pool Link</h1>
      </div>
    )
  }

  useEffect(() => {
    if (loading === false) {
      if (user) {
        const poolId = searchParams.get('id');

        const getPool = async () => {
          const poolData = await getPoolData(poolId);
          setPoolData(poolData);
    
          if (poolData.poolOwner === userData.userId) {
            setIsOwner(true);
          }

          console.log(poolData, userData)

          setLoading(false);
    
    
          if (!poolData) {
            console.log('Pool not found')
          }
        }
        getPool();
    } else {
      router.push('/login')
    }
    }
  }, [loading])


  if (ClientLoading) {
    return (
      <div className='flex flex-col gap-1 w-full max-w-screen-2xl m-auto p-5 justify-between pt-0'>
        <h1>Loading...</h1>
      </div>
    )
  }

  
  return (
    <div className='flex flex-col gap-1 w-full max-w-screen-2xl m-auto p-5 justify-between pt-0'>
      <h1 className='font-bold tracking-tighter text-4xl'>Jguns Pool</h1>
    </div>
  )
}
