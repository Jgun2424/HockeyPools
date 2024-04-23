'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { UserAuth } from '../firebase/AuthContext'
import {Button} from '@/components/ui/button'
import { toast } from 'sonner'
import { addDoc, collection, getDocs } from 'firebase/firestore'
import { db } from '@/app//firebase/firebase'
import DraftAdmin from '@/components/Draft/DraftAdmin'


export default function page() {

    const searchParams = useSearchParams();

    const { getPoolData, userData, loading, user } = UserAuth();
    const [poolData, setPoolData] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [ClientLoading, setLoading] = useState(true);
    const [draftExists, setDraftExists] = useState(false);


    useEffect(() => {
        if (loading === false) {
            if (user) {
                const poolId = searchParams.get('id');

                const getPool = async () => {
                    const poolData = await getPoolData(poolId);

                    if (poolData.success === false) return toast.error(poolData.error);

                    if (poolData.draftData.length > 0) {
                        setDraftExists(true);

                        
                    }

                    setPoolData(poolData);
            
                    if (poolData.poolOwner === userData.userId) {
                        setIsOwner(true);
                    }

                    console.log(poolData, userData)

                    setLoading(false);
                }
                getPool();
            }
        }
    } , [loading, draftExists])

    
    console.log(draftExists)

    const createDraft = async () => {
        const draftCollection = collection(db, 'pools', searchParams.get('id'), 'draft');
        const draftSnapshot = await getDocs(draftCollection);

        if (draftSnapshot.size > 0) {
            return toast.error('Draft already exists');

        }

        const draftData = {
            draftOrder: [],
            joinedPlayers: [],
            status: 'starting',
            currentlyPicking: 0
        }

        await addDoc(draftCollection, draftData)

        setDraftExists(true);


    }


    if (ClientLoading) return <div>Loading...</div>

    if (isOwner === false) return (
        <div className='flex flex-col gap-1 w-full max-w-screen-2xl m-auto p-5 justify-between pt-0'>
            <h1>Unauthorized</h1>
        </div>
    )

  return (
    <div className='flex flex-col gap-1 w-full max-w-screen-2xl m-auto p-5 justify-between pt-0'>
        <div className='flex flex-col gap-1 mb-3'>
            <h1 className='text-2xl font-bold'>Draft Admin Controls</h1>
            <p>Keep This Page Open During The Draft</p>
        </div>

        {!draftExists && (
            <div>
                <Button variant='default' onClick={() => createDraft()}>Start Draft</Button>
            </div>
            )}

        {draftExists && (
                <DraftAdmin />
            )}
    </div>
  )
}
