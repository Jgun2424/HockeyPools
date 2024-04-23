'use client'

import React, { useEffect, useRef, useState } from 'react'
import { UserAuth } from '../firebase/AuthContext'
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/app/firebase/firebase';
import { toast } from 'sonner';


import { v4 as uuidv4 } from 'uuid';

export default function page() {
    const [poolsCreated, setPoolsCreated] = useState(null)
    const [buttonLoading, setButtonLoading] = useState(false)
    const [ClientLoading, setLoading] = useState(true)
    const goalPoints = useRef<HTMLInputElement>(null);
    const assistPoints = useRef<HTMLInputElement>(null);
    const hitPoints = useRef<HTMLInputElement>(null);
    const blockPoints = useRef<HTMLInputElement>(null);
    const fightPoints = useRef<HTMLInputElement>(null);
    const winPoints = useRef<HTMLInputElement>(null);
    const shutoutPoints = useRef<HTMLInputElement>(null);
    const poolNameRef = useRef<HTMLInputElement>(null);
    const poolPasswordRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLInputElement>(null);


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
        setButtonLoading(true);
        const getValue = (ref) => ref?.current?.value || '';
        const getNumericValue = (ref) => Number(ref?.current?.value) || 0;
    
        const poolName = getValue(poolNameRef);
        const poolPassword = getValue(poolPasswordRef);
    
        const goalPointsValue = getNumericValue(goalPoints);
        const assistPointsValue = getNumericValue(assistPoints);
        const hitPointsValue = getNumericValue(hitPoints);
        const blockPointsValue = getNumericValue(blockPoints);
        const fightPointsValue = getNumericValue(fightPoints);
        const winPointsValue = getNumericValue(winPoints);
        const shutoutPointsValue = getNumericValue(shutoutPoints);
    
        if (!poolName || !poolPassword) {
            setButtonLoading(false);
            return toast.error('Please fill in all fields');
        }
    
        const image = imageRef.current?.files[0];
    
        if (image) {
            const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
            if (image.size > maxSizeInBytes) {
                return toast.error('Image size exceeds 5MB. Please select a smaller image.');
            }
        }
    
        let imageUrl = '';
        if (image) {
            const imageStorageRef = ref(storage, `pool_images/${uuidv4()}`);
            await uploadBytes(imageStorageRef, image);
            imageUrl = await getDownloadURL(imageStorageRef);
        }
        const poolScoring = {
            goals: goalPointsValue,
            assists: assistPointsValue,
            hits: hitPointsValue,
            blocks: blockPointsValue,
            fights: fightPointsValue,
            wins: winPointsValue,
            shutouts: shutoutPointsValue
        };
        const poolID = uuidv4();
        const data = {
            poolName: poolName,
            poolPassword: poolPassword,
            poolOwner: user.uid,
            poolOwnerName: user.displayName,
            isPoolAcceptingMembers: true,
            poolScoringRules: poolScoring,
            poolID: poolID,
            poolImage: imageUrl
        }

    
        const response = await createPool(data, poolID);
    
        if (response.success) {
            toast.success('Pool created successfully!');
            router.push(`/pool?id=${poolID}`);
        } else {
            toast.error(response.error);
            setButtonLoading(false);
        }
    };


  return (
    <div className="flex flex-col gap-1 w-full max-w-screen-lg m-auto p-5 justify-between pt-20">
        {/* create new hockey pool form */}

        <div className='flex flex-col gap-1'>
            <h1 className='text-4xl font-bold tracking-tighter'>Create New Pool</h1>

            <div className='flex flex-col gap-2 mt-2'>
                <Input type="text" placeholder="Pool Name" ref={poolNameRef}/>
                <Input type="text" placeholder="Pool Password" ref={poolPasswordRef}/>
                <span>Image</span>
                <Input id="picture" type="file" ref={imageRef}/>

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
                <Button variant="default" onClick={() => handleCreatePool()} disabled={buttonLoading}>Create Pool</Button>
            </div>
        </div>
    </div>
  )
}
