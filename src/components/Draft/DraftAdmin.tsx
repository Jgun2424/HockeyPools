'use client'

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { db } from '@/app/firebase/firebase';
import { doc, collection, onSnapshot, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { UserAuth } from '@/app/firebase/AuthContext';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { toast } from 'sonner';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { useRouter } from 'next/navigation';
import { Copy } from 'lucide-react';
import { Input } from '../ui/input';

export default function DraftAdmin() {
    const searchParams = useSearchParams();
    const { user } = UserAuth();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [draft, setDraft] = useState(null);
    const [draftId, setDraftId] = useState(null); 


    useEffect(() => {
        if (searchParams.get('id')) {
            const poolRef = doc(db, 'pools', searchParams.get('id'));
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
                   
                    
                });
            });

            return () => unsubscribe();
        }
    }, [user]);

    if (loading) return <div>Loading...</div>;

    const handleShuffleDraft = async () => {
        if (draft.joinedPlayers.length < 2) {
            return toast.error('You need at least 2 players to start the draft');
        }

        await updateDoc(doc(db, 'pools', searchParams.get('id'), 'draft', draftId), {
            status: 'shuffling'
        });

        await fetch(`https://d66545a3-447c-419f-8ae8-c8d5cf427615-00-qc988hrk28sr.kirk.replit.dev/api/draftorder/${searchParams.get('id')}/${draftId}`); // Shuffle draft order
    }

    const handleStartDraft = async () => {
        await updateDoc(doc(db, 'pools', searchParams.get('id'), 'draft', draftId), {
            status: 'draft_started'
        });
    }

    const handleEndDraft = async () => {
        await updateDoc(doc(db, 'pools', searchParams.get('id'), 'draft', draftId), {
            status: 'draft_ended'
        });
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Link copied to clipboard');
      }

      const renderJoinedMembers = () => (
        <div>
            <h1>Joined Members</h1>
            <ul className='flex flex-col gap-2'>
                {draft.joinedPlayers.map((member: any) => (
                        <div className='flex flex-col justify-between items-start w-full rounded-sm p-1 bg-muted gap-2 cursor-pointer ' key={member?.userId} >
                        <div className='flex flex-row gap-2 items-center'>
                        <Avatar>
                          <AvatarFallback>{member?.userName.charAt(0).toUpperCase()}{member?.userName.charAt(1).toUpperCase()}</AvatarFallback>
                        </Avatar>
                
                          <h1 className='text-base flex items-center gap-2'>{member?.userName}</h1>
                        </div>
                        </div>
                ))}
            </ul>
        </div>
    );
    


    if (draft.status === 'starting') {
        return (
            <div className='flex flex-col p-7 bg-primary-foreground  rounded-lg'>
                <span className='text-lg font-bold mb-2'>The draft is now in starting mode. Please allow members of the pool to join the draft. </span>

                <div className='grid grid-cols-2'>
                    <div className='flex flex-col items-start justify-center gap-2'>
                        <Button onClick={() => handleShuffleDraft()}>Shuffle Draft</Button>
                        <Dialog>
                            <DialogTrigger asChild>
                            <Button variant='default'>Invite To Draft</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Invite Members</DialogTitle>
                                <DialogDescription>
                                Share this link with your friends to invite them to your pool.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex items-center space-x-2">
                                <div className="grid flex-1 gap-2">
                                <Label htmlFor="link" className="sr-only">
                                    Link
                                </Label>
                                <Input
                                    id="link"
                                    defaultValue={`http://localhost:3000/draft?pool_id=${searchParams.get('id')}`}
                                    readOnly
                                />
                                </div>
                                <Button type="submit" size="sm" className="px-3" onClick={() => copyToClipboard(`http://localhost:3000/draft?pool_id=${searchParams.get('id')}`)}>
                                <span className="sr-only">Copy</span>
                                <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                            <DialogFooter className="sm:justify-start">
                                <DialogClose asChild>
                                <Button type="button" variant="secondary">
                                    Close
                                </Button>
                                </DialogClose>
                            </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>


                        

                    {renderJoinedMembers()}
                </div>
            </div>
        );
    }

    if (draft.status === 'shuffling_done') {
        return (
            <div className='flex flex-col p-7 bg-primary-foreground  rounded-lg'>
                <span className='text-lg font-bold mb-2'>Draft Order Is Complete.</span>

                <div className='grid grid-cols-2'>
                    <div className='flex flex-col items-start justify-center gap-2'>
                        <Button onClick={() => handleStartDraft()}>Start Draft</Button>
                    </div>


                    {renderJoinedMembers()}
                </div>
            </div>
        );
    }

    if (draft.status === 'shuffling') {
        return (
            <div className='flex flex-col p-7 bg-primary-foreground  rounded-lg'>
                <span className='text-lg font-bold mb-2'>Shuffling draft order</span>
            </div>
        );
    }

    if (draft.status === 'draft_started') {
        return (
            <div className='flex flex-col p-7 bg-primary-foreground  rounded-lg'>
                <span className='text-lg font-bold mb-2'>Draft has started.</span>

                <div className='grid grid-cols-2'>
                    <div className='flex flex-col items-start justify-center gap-2'>
                        <Button onClick={() => handleEndDraft()} variant='destructive'>End Draft</Button>
                    </div>

                    {renderJoinedMembers()}
                </div>
            </div>
        );
    }

}
