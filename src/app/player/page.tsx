'use client'

import React, {useEffect, useState} from 'react'
import { useSearchParams } from 'next/navigation'
import { UserAuth } from '../firebase/AuthContext';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge, Link } from 'lucide-react';
import ViewRoster from '@/components/Pool/ViewRoster';

export default function page() {
  const searchParams = useSearchParams();
  const { getPoolData, userData, loading, getPoolMemberInfo } = UserAuth();
  const [clientLoading, setClientLoading] = useState(true);
  const [playoffTeams, setPlayoffTeams] = useState(null);
  const [allTeamData, setAllTeamData] = useState(null); 
  const [selectedTeam, setSelectedTeam] = useState('');
  const [playerData, setPlayerData] = useState(null);

  useEffect(() => {

    if (searchParams.get('player_id') || searchParams.get('pool_id')) {
        if (loading === false) {
            const poolId = searchParams.get('pool_id');
            const playerId = searchParams.get('player_id');

            const gatherPoolData = async () => {
                const poolData = await getPoolData(poolId);

                if (poolData.success === false) return toast.error(poolData.error); // check if pool data was successfully retrieved
                if (poolData.poolOwner !== userData.userId) return toast.error('Only the pool owner can add/edit players'); // check if user is pool owner
                
                const playerData = await getPoolMemberInfo(playerId, poolId);

                setPlayerData(playerData);
                
                const playoffTeamData = await fetch('https://d66545a3-447c-419f-8ae8-c8d5cf427615-00-qc988hrk28sr.kirk.replit.dev/api/teams/players')
                const playoffTeamDataJson = await playoffTeamData.json();

                setPlayoffTeams(playoffTeamDataJson);

                setClientLoading(false);
            }

            gatherPoolData();
        }
    }
  }, [loading])

  if (clientLoading) return <div>Loading...</div>;

  console.log(selectedTeam)

  const handleSelectedTeam = (e) => {
    setSelectedTeam(e)

    console.log(e)
    playoffTeams?.map((team: any) => {
        if (team.team === e) {
            setAllTeamData(team)
        }
    })
  }

  return (
    <div className='flex flex-col gap-1 w-full max-w-screen-2xl m-auto p-5 justify-between pt-0'>
        <Card className='bg-muted mb-1'>
            <CardHeader>
                <CardTitle className="flex flex-row gap-2 items-center">Editing Player {playerData?.userName}</CardTitle>
                <CardDescription>
                    <p>Make sure to select the correct team for the player</p>
                </CardDescription>
            </CardHeader>
            <CardFooter className="border-t px-6 flex flex-row gap-2"  >
              <Select onValueChange={(e) => handleSelectedTeam(e)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Team" />
                </SelectTrigger>
                <SelectContent>
                    {playoffTeams?.map((team: any) => (
                        <SelectItem key={team.team} value={team.team}>{team.team}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </CardFooter>
        </Card>


          <ViewRoster selectedTeam={selectedTeam} allTeamData={allTeamData} loading={clientLoading} poolId={searchParams.get('pool_id')}/> 

    </div>
  )
}
