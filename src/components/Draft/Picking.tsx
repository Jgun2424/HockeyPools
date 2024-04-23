'use client'
import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { UserAuth } from '../../app/firebase/AuthContext';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ViewRoster from '@/components/Pool/ViewRoster';

export default function Picking(props: any) {
  const searchParams = useSearchParams();
  const { getPoolData, userData, loading, getPoolMemberInfo } = UserAuth();
  const [clientLoading, setClientLoading] = useState(true);
  const [playoffTeams, setPlayoffTeams] = useState(null);
  const [allTeamData, setAllTeamData] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [playerData, setPlayerData] = useState(null);
  const [cachedPoolData, setCachedPoolData] = useState(null); // State variable for cached poolData

  useEffect(() => {
    if (!props.playerId || !props.poolId || loading) return;

    const gatherPoolData = async () => {
      try {
        let poolData;

        // Check if poolData is already cached
        if (cachedPoolData) {
          poolData = cachedPoolData;
        } else {
          // Fetch poolData if not cached
          poolData = await getPoolData(props.poolId);
          console.log(' refreshing pool data');
          if (!poolData.success) {
            toast.error(poolData.error);
            return;
          }
          // Cache the fetched poolData
          setCachedPoolData(poolData);
        }

        const playerData = await getPoolMemberInfo(props.playerId, props.poolId);
        setPlayerData(playerData);

        const playoffTeamData = await fetch('https://d66545a3-447c-419f-8ae8-c8d5cf427615-00-qc988hrk28sr.kirk.replit.dev/api/teams/players');
        const playoffTeamDataJson = await playoffTeamData.json();
        setPlayoffTeams(playoffTeamDataJson);

        setClientLoading(false);
      } catch (error) {
        console.error("Error fetching pool data:", error.message);
        toast.error("Failed to fetch pool data.");
      }
    };

    gatherPoolData();
  }, [props.playerId, props.poolId, loading, cachedPoolData]); // Include cachedPoolData in dependency array

  const handleSelectedTeam = (e) => {
    setSelectedTeam(e);

    console.log(e);
    const teamData = playoffTeams?.find(team => team.team === e);
    setAllTeamData(teamData);
  };

  const renderWaitingComponent = () => (
    <div className='flex flex-col gap-1 w-full max-w-screen-2xl m-auto p-5 justify-between pt-0'>
      <Card className='bg-muted mb-1'>
        <CardHeader>
          <CardTitle className="flex flex-row gap-2 items-center">Waiting for other players to pick</CardTitle>
          <CardDescription>
            <p>It will be your turn soon</p>
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );

  const renderPickingComponent = () => (
    <div className='flex flex-col gap-1 w-full max-w-screen-2xl m-auto p-5 justify-between pt-0'>
      <Card className='bg-muted mb-1'>
        <CardHeader>
          <CardTitle className="flex flex-row gap-2 items-center">Hey! Its your turn to pick</CardTitle>
          <CardDescription>
            <p>Pick any player that is available</p>

            <Select onValueChange={(e) => handleSelectedTeam(e)}>
            <SelectTrigger className="w-[180px] mt-3">
              <SelectValue placeholder="Select Team" />
            </SelectTrigger>
            <SelectContent>
              {playoffTeams?.map((team: any) => (
                <SelectItem key={team.team} value={team.team}>{team.team}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          </CardDescription>
        </CardHeader>
      </Card>
      <ViewRoster selectedTeam={selectedTeam} allTeamData={allTeamData} loading={clientLoading} poolId={searchParams.get('pool_id')} addToRoster={props.handleSelection} fromDraft={true} />
    </div>
  );

  return props.isMyTurn ? renderPickingComponent() : renderWaitingComponent();
}
