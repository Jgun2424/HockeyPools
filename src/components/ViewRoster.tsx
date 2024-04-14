import React, {useEffect, useState} from 'react'
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { StarIcon, StarsIcon } from 'lucide-react';
import { Icon } from '@iconify/react';
import PlayerCard from './PlayerCard';

export default function ViewRoster(props: any) {
    const [defensePlayers, setDefensePlayers] = useState([]);
    const [forwardPlayers, setForwardPlayers] = useState([]);

    useEffect(() => {
        if (props.selectedTeam !== '') {
            const points = props.allTeamData.players;

            // Filter players who have played more than 5 games
            const filteredPlayers = points.filter(player => player.games_played > 13);
            
            // Separate players into groups based on their positions
            const defensePlayers = filteredPlayers.filter(player => player.position === "D");
            const forwardPlayers = filteredPlayers.filter(player => player.position === "F");
            
            // Sort players within each group based on their points in descending order
            const sortedDefensePlayers = defensePlayers.sort((a, b) => b.points - a.points);
            const sortedForwardPlayers = forwardPlayers.sort((a, b) => b.points - a.points);
            
            console.log("Sorted Defense Players:");
            console.log(sortedDefensePlayers);

            setDefensePlayers(sortedDefensePlayers);
            setForwardPlayers(sortedForwardPlayers);
            
            console.log("Sorted Forward Players:");
            console.log(sortedForwardPlayers);
            
        }
    }, [props])


    if (props.loading) return <div>Loading...</div>
    
    if (props.selectedTeam === '') return <div>Select a team</div>

    console.log(props);

    

  return (

    <div className="flex flex-col gap-2 mt-6">
        <h1 className="text-2xl font-bold text-primary">Forwards</h1>
            <div className="grid gap-3 grid-cols-4 max-[1200px]:grid-cols-3 max-[900px]:grid-cols-2 max-[550px]:grid-cols-1">       
            {forwardPlayers.map((player: any, index: number) => {
                return (
                    <PlayerCard player={player}/>
                )
            })}
            </div>
            <h1 className="text-2xl font-bold text-primary mt-6">Defence</h1>
            <div className="grid gap-3 grid-cols-4 max-[1200px]:grid-cols-3 max-[900px]:grid-cols-2 max-[550px]:grid-cols-1">       
            {defensePlayers.map((player: any, index: number) => {
                return (
                    <PlayerCard player={player}/>
                )
            })}
            </div>

    </div>
  )
}
