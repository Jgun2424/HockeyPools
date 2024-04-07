'use client'

import { useState, useEffect, useRef } from 'react';
import { UserAuth } from '../../firebase/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Page({ params }: { params: { invite_id: string } }) {
    const router = useRouter();
    const { getPoolData, userData, loading, user, joinPool } = UserAuth();
    const [poolData, setPoolData] = useState(null);
    const [clientLoading, setClientLoading] = useState(true);

    const poolPasswordRef = useRef<HTMLInputElement>(null);

    // check auth state

    useEffect(() => {
        if (loading === false) {
          if (!user) return router.push(`/login?ref=fromInvite&invite_id=${encodeURIComponent(params.invite_id)}`); // redirect to login if user is not logged in

          const getPool = async () => {
            const poolData = await getPoolData(params.invite_id);
    
            if (poolData.success === false) return toast.error(poolData.error);

            setClientLoading(false);

            setPoolData(poolData); // set pool data to state
    

            if (poolData.isPoolAcceptingMembers === false) return toast.error('This pool is not accepting members at this time'); // check if pool is accepting members

            
            console.log(poolData, userData) 
          }
          getPool();
        }
    }, [loading])
    


    if (clientLoading) {
        return (
          <div className='flex flex-col gap-1 w-full max-w-screen-2xl m-auto p-5 justify-between pt-0'>
            <h1>Loading...</h1>
          </div>
        )
      }


      const handleJoinPool = async () => {
        const poolPassword = poolPasswordRef.current?.value;

        if (!poolPassword) return toast.error('Please enter the pool password');

        const joinPoolResponse = await joinPool(poolData?.poolID, poolPassword, userData.userId);

        if (joinPoolResponse.success === false) return toast.error(joinPoolResponse.error);

        toast.success('You have joined the pool successfully!');
      }



    return (
      <div className="flex flex-col gap-1 w-full max-w-screen-2xl m-auto p-5 justify-between pt-0">
      <div className='grid grid-cols-2 h-[89vh]'>
          <div className="bg-secondary rounded-l-lg flex flex-col p-10 gap-2 justify-center shadow-inner">
              <h1 className="text-5xl text-primary font-bold tracking-tighter text-center">You've been invited!</h1>
              <p className="tracking-tight text-center">{poolData?.poolOwnerName} wants you to join {poolData?.poolName}</p>

              <div className='flex flex-col gap-2 mt-3 items-center'>
                  <Input type="password" placeholder="Pool Password" ref={poolPasswordRef}/>
                  <Button  variant="default" className='w-full' onClick={() => handleJoinPool()}>Join</Button>
              </div>

          </div>
          <img src="https://wallpapercave.com/wp/wp2526463.jpg" alt="" className=" rounded-r-lg h-full object-cover shadow-inner"/>
      </div>
  </div>
    )
  }