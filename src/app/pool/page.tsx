'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import { UserAuth } from '../firebase/AuthContext';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Input } from '@/components/ui/input';
import PoolMembers from '../../components/PoolMembers';


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

          if (poolData.success === false) return toast.error(poolData.error);

          // if (poolData.poolMembers.filter((member: any) => member.userId === userData.userId).length === 0) {
          //   toast.error('You are not a member of this pool');
          //   return router.push('/');
          // }

          setPoolData(poolData);
    
          if (poolData.poolOwner === userData.userId) {
            setIsOwner(true);
          }

          console.log(poolData, userData)

          setLoading(false);
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Link copied to clipboard');
  }

  
  return (
    <div className='flex flex-col gap-1 w-full max-w-screen-2xl m-auto p-5 justify-between pt-0'>
      <div className='flex flex-col gap-2'>
        <Card className='flex flex-row p-5 rounded-lg'>
          <h1 className='text-3xl font-bold text-primary'>{poolData?.poolName}</h1>
        </Card>
        <div className='grid grid-cols-2 gap-2'>

          <Card className='flex flex-col p-5 rounded-lg'>
            <div className='flex flex-row justify-between items-center w-full'>
              <h1 className='text-lg'>Pool Leaders</h1>
            </div>
          </Card>

          <Card className='flex flex-col p-5 rounded-lg'>
            <div className='flex flex-row justify-between items-center w-full'>
              <h1 className='text-lg'>Members</h1>
              <Badge>{poolData?.poolMembers?.length}</Badge>
            </div>

            <div className='flex flex-col gap-2 mt-2'>
              {
                poolData?.poolMembers?.map((member: any) => (
                  <PoolMembers username={member.userName} uid={member.userId} data={member} key={member.userId} poolOwner={poolData?.poolOwner} poolId={searchParams.get('id')}/>
                ))
              }
            </div>
          </Card>

        </div>

        <div className='flex flex-row gap-2 justify-between mt-2'>
          <div className='flex flex-row gap-2 '>
              {
                isOwner && (
                  <>
                    <Button variant='default'>Edit Pool</Button>
                    <Button variant='destructive'>Delete Pool</Button>
                  </>
                )
              }
          </div>


          <Dialog>
            <DialogTrigger asChild>
            <Button variant='default'>Invite Members</Button>
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
                    defaultValue={`http://localhost:3000/invite/${poolData.poolID}`}
                    readOnly
                  />
                </div>
                <Button type="submit" size="sm" className="px-3" onClick={() => copyToClipboard(`http://localhost:3000/invite/${poolData.poolID}`)}>
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

      </div>



    </div>
  )
}
