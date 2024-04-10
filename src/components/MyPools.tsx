import React, {useEffect, useState} from 'react'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { UserAuth } from '@/app/firebase/AuthContext'
import PoolDetails from './PoolDetails';

export default function MyPools() {

    const { userData, loading } = UserAuth();
    const [pools, setPools] = useState(null);
    const [clientLoading, setClientLoading] = useState(true);


    useEffect(() => {
        if (loading === false) {
            setClientLoading(false)
            setPools(userData.poolsJoinedList)
            console.log(userData)
        }
    }, [loading])
  
    if (clientLoading) return <div>Loading...</div>

  return (
    <div className='flex flex-col gap-2'>
        <h1 className='text-2xl tracking-tighter font-bold'>Pools You've Joined ({userData?.poolsJoined})</h1>

        <div className="grid gap-3">
            {pools?.map((pool: any) => (
                <PoolDetails key={pool.poolId} pool={pool} />
            ))}
        </div>

    </div>
  )
}
