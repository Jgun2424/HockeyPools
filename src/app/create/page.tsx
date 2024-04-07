'use client'

import React, { useEffect, useRef, useState } from 'react'
import { UserAuth } from '../firebase/AuthContext'
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export default function page() {
    const [poolsCreated, setPoolsCreated] = useState(null)
    const [ClientLoading, setLoading] = useState(true)
    const goalPoints = useRef<HTMLInputElement>(null);
    const assistPoints = useRef<HTMLInputElement>(null);
    const hitPoints = useRef<HTMLInputElement>(null);
    const blockPoints = useRef<HTMLInputElement>(null);
    const fightPoints = useRef<HTMLInputElement>(null);
    const winPoints = useRef<HTMLInputElement>(null);
    const shutoutPoints = useRef<HTMLInputElement>(null);
    const poolNameRef = useRef<HTMLInputElement>(null);
    const poolDescRef = useRef<HTMLInputElement>(null);
    const poolPasswordRef = useRef<HTMLInputElement>(null);


    const router = useRouter();
    const { user, userData, loading, createPool } = UserAuth();

    useEffect(() => {
        if (loading === false) {
            if (user) {
                setPoolsCreated(userData.poolsCreated)
                setLoading(false)
            } else {
                router.push('/login')
            }
        }
    }, [loading]);

    
    if (ClientLoading) {
        return <div>Loading...</div>
    }


    const handleCreatePool = async () => {
        const poolName = poolNameRef.current?.value;
        const poolDesc = poolDescRef.current?.value;
        const poolPassword = poolPasswordRef.current?.value;
        const goalPointsValue = goalPoints.current?.value;
        const assistPointsValue = assistPoints.current?.value;
        const hitPointsValue = hitPoints.current?.value;
        const blockPointsValue = blockPoints.current?.value;
        const fightPointsValue = fightPoints.current?.value;
        const winPointsValue = winPoints.current?.value;
        const shutoutPointsValue = shutoutPoints.current?.value;

        if (!poolName || !poolDesc || !poolPassword) {
            toast.error('Please fill in all fields')
            return;
        }


        if (userData?.poolsCreated > 0) {
            toast.error('You can only create one pool at a time')
            return;
        }

        const poolScoring = {
            goals: Number(goalPointsValue),
            assists: Number(assistPointsValue),
            hits: Number(hitPointsValue),
            blocks: Number(blockPointsValue),
            fights: Number(fightPointsValue),
            wins: Number(winPointsValue),
            shutouts: Number(shutoutPointsValue)
        }

        const Response = await createPool(poolName, poolDesc, poolPassword, poolScoring, uuidv4())

        if (Response.success === true) {
            toast.success('Pool created successfully!')
        } else {
            toast.error(Response.error)
        }


    }
    


  return (
    <div className="flex flex-col gap-1 w-full max-w-screen-lg m-auto p-5 justify-between pt-20">
        {/* create new hockey pool form */}

        <div className='flex flex-col gap-1'>
            <h1 className='text-4xl font-bold tracking-tighter'>Create New Pool</h1>

            <div className='flex flex-col gap-2 mt-2'>
                <Input type="text" placeholder="Pool Name" ref={poolNameRef}/>
                <Input type="text" placeholder="Pool Description" ref={poolDescRef}/>
                <Input type="text" placeholder="Pool Password" ref={poolPasswordRef}/>

                <div className='bg-secondary p-5 rounded-lg mb-2 mt-2'>
                <h1 className='text-2xl font-bold tracking-tighter'>Points System</h1>
                <p>
                    The following will be the points system for the players in your pool. For example, if you want to give more points for goals, you can adjust the points here.
                </p>

                <h1 className='text-xl font-bold tracking-tighter mt-3'>Player Stats</h1>
                <div className='flex flex-row gap-2'>
                    <div>
                        <h1 className='text-lg font-bold tracking-tighter'>Goals</h1>
                        <Input type="number" defaultValue="1" ref={goalPoints}/>
                    </div>
                    <div>
                        <h1 className='text-lg font-bold tracking-tighter'>Assists</h1>
                        <Input type="number" defaultValue="1" ref={assistPoints}/>
                    </div>
                    <div>
                        <h1 className='text-lg font-bold tracking-tighter'>Hits</h1>
                        <Input type="number" defaultValue="0" ref={hitPoints}/>
                    </div>
                    <div>
                        <h1 className='text-lg font-bold tracking-tighter'>Blocks</h1>
                        <Input type="number" defaultValue="0" ref={blockPoints}/>
                    </div>
                    <div>
                        <h1 className='text-lg font-bold tracking-tighter'>Fights</h1>
                        <Input type="number" defaultValue="0" ref={fightPoints}/>
                    </div>
                </div>

                <h1 className='text-xl font-bold tracking-tighter mt-3'>Goalie Stats</h1>

                <div className='flex flex-row gap-2'>
                    <div>
                        <h1 className='text-lg font-bold tracking-tighter'>Wins</h1>
                        <Input type="number" defaultValue="1" ref={winPoints}/>
                    </div>
                    <div>
                        <h1 className='text-lg font-bold tracking-tighter'>Shutouts</h1>
                        <Input type="number" defaultValue="2" ref={shutoutPoints}/>
                    </div>
                </div>
                                    
                </div>
                <Button variant="default" onClick={() => handleCreatePool()}>Create Pool</Button>
            </div>
        </div>
    </div>
  )
}
