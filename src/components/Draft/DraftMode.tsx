'use client'

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { db } from '@/app/firebase/firebase';
import { doc, collection, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import { UserAuth } from '@/app/firebase/AuthContext';
import { Button } from '../ui/button';
import { CheckCircle2Icon } from 'lucide-react';
import classes from './Anim.module.css'
import ReactAudioPlayer from 'react-audio-player';
import { ScratchCard } from 'next-scratchcard';
import Picking from './Picking';

export default function DraftMode() {
    const searchParams = useSearchParams();
    const { user } = UserAuth();

    const [loading, setLoading] = useState(true);
    const [draft, setDraft] = useState(null);
    const [draftId, setDraftId] = useState(null); 
    const [hasJoined, setHasJoined] = useState(false);
    const [draftInfo, setDraftInfo] = useState(null);
    const [currentlyPicking, setCurrentlyPicking] = useState(null); // [userId, pickNumber
    const [isMyTurn, setIsMyTurn] = useState(false);
    const [draftOrder, setDraftOrder] = useState(null);
    const [isDraftPositionRevealed, setIsDraftPositionRevealed] = useState(false);

    useEffect(() => {
        if (searchParams.get('pool_id')) {
            const poolRef = doc(db, 'pools', searchParams.get('pool_id'));
            const draftRef = collection(poolRef, 'draft');

            if (!user) return;

            // Subscribe to changes in the draft document
            const unsubscribe = onSnapshot(draftRef, (snapshot) => {
                snapshot.docs.forEach(doc => {
                    const draftData = doc.data();

                    console.log("Draft data:", draftData);
                    setDraftId(doc.id);
                    setDraft(draftData);
                    setLoading(false);

                    if (draftData.status === 'shuffling_done') {
                        const index = draftData.draftOrder.findIndex(userData => userData.userId === user.uid);
                        setDraftOrder(index);
                        setHasJoined(true);
                    }

                    if (draftData.status === 'draft_started') {
                        const currentPicking = draftData.currentlyPicking
                        const draftOrderLength = draftData.draftOrder.length;
                        
                        setCurrentlyPicking(currentPicking);
                        

                        if (draftData.draftOrder[currentPicking].userId === user.uid) {
                            setIsMyTurn(true);
                            console.log("It's my turn!")
                        } else {
                            setIsMyTurn(false);
                        }
                    }
                });
            });

            return () => unsubscribe();
        }
    }, [user]);

    const handleJoinDraft = async () => {
        setHasJoined(true);
        console.log(draft);
        const poolRef = doc(db, 'pools', searchParams.get('pool_id'), 'draft', draftId);
        await updateDoc(poolRef, {
            joinedPlayers: arrayUnion({
                userId: user.uid,
                userName: user.displayName,
            }),
        });
    }

    const handleRevealDraftPosition = () => {
        document.body.classList.add(classes.overflow);
        setIsDraftPositionRevealed(true);
        setTimeout(() => {
            document.body.classList.add(classes.slamAndShakeAnimation);
            document.body.classList.remove(classes.overflow);
            setDraftInfo(true);
        }, 2000);

        setTimeout(() => {
            document.body.classList.remove(classes.slamAndShakeAnimation);
        }, 4000);
    }

    const handleSelection = async () => {
        const poolRef = doc(db, 'pools', searchParams.get('pool_id'), 'draft', draftId);
    
        const currentPicking = draft.currentlyPicking;
        const draftOrderLength = draft.draftOrder.length - 1;
    
        console.log(currentPicking + 1);
    
        if (currentPicking >= draftOrderLength) {
            await updateDoc(poolRef, {
                currentlyPicking: 0,
            });
        } else {
            await updateDoc(poolRef, {
                currentlyPicking: currentPicking + 1,
            });
        }
    };

    if (loading) return <div>Loading...</div>;

    if (draft.status === 'starting') {
        return (
            <div>
                <h1>{draft?.draftName}</h1>
                <p>{draft?.draftDescription}</p>
                <Button onClick={handleJoinDraft}>Join Draft</Button>
            </div>
        );
    }

    if (draft.status === 'shuffling') {
        return (
            <div className='flex flex-col gap-1 w-full max-w-screen-lg m-auto p-5 justify-between pt-5'>      
                <div className='flex justify-center'>
                    <h1 className='text-3xl font-medium tracking-tighter'>Shuffling draft order</h1>
                </div>
                <div className='flex justify-center'>
                    <img src="https://i.pinimg.com/originals/05/15/78/051578107e88f8de02a8568e0f3eee4c.gif" alt="" className='w-64'/>
                </div>
            </div>
        );
    }

    if (draft.status === 'shuffling_done') {
        return (
            <div className='flex flex-col gap-1 w-full max-w-screen-lg m-auto p-5 justify-between pt-5'>
            <div className='flex flex-col items-center mt-3 gap-4'>
                <h1 className='text-3xl font-bold tracking-tighter'>Draft order is complete</h1>
                {isDraftPositionRevealed ? (
                <div className='flex flex-col items-center gap-2'>
                    <h1>You Pick...</h1>
                    <ReactAudioPlayer
                    src="./audio.mp3"
                    autoPlay
                    volume={0.3}
                    />

                    <h1 className='text-9xl font-bold animate-slamAndShake'>{draftOrder + 1}{draftOrder === 0 ? "st" : draftOrder === 1 ? "nd" : "rd"}</h1>

                    {draftInfo && (<span>Waiting for host..</span>)}
                </div>
                ) : (
                <Button onClick={handleRevealDraftPosition}>Reveal Draft Position</Button>
                
                )}
            </div>
            </div>
        );
    }

    if (draft.status === 'draft_started') {
        return (
            <div className='flex flex-col gap-1 w-full max-w-screen-2xl m-auto p-5 justify-between pt-5'>
                <Picking playerId={draft.draftOrder[currentlyPicking].userId} poolId={searchParams.get('pool_id')} handleSelection={handleSelection} isMyTurn={isMyTurn}/>
            </div>
        );
    }


    if (draft.status === 'draft_ended') {
        return (
            <div className='flex flex-col gap-1 w-full max-w-screen-2xl m-auto p-5 justify-between pt-5'>
                <h1 className='text-3xl font-medium tracking-tighter'>Draft has ended</h1>
            </div>
        );
    }
}
