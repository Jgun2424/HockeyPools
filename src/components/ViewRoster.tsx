import React, {useEffect, useState} from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

export default function ViewRoster(props: any) {
    const [defensePlayers, setDefensePlayers] = useState([]);
    const [forwardPlayers, setForwardPlayers] = useState([]);

    useEffect(() => {
        if (props.selectedTeam !== '') {
            const points = props.allTeamData.players;

            // Filter players who have played more than 5 games
            const filteredPlayers = points.filter(player => player.games_played > 7);
            
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

  return (

    <div className="flex flex-col gap-2">
        <div className="grid gap-3">
        <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Player</TableHead>
                        <TableHead className='text-center'>Points</TableHead>
                        <TableHead className='text-right'>Player Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {forwardPlayers.map((player: any) => (
                        <TableRow key={player.player_id} className='cursor-pointer'>
                            <TableCell className='w-full flex items-end gap-3'><img src={`https://int-images.sportsnet.ca/player_headshots/NHL/280/${player.id}.png`} alt="" className='w-[70px]'/><span className='text-xl'>{player.first_name}, {player.last_name} ({player.position})</span></TableCell>
                            <TableCell className='text-center text-2xl font-bold'>{player.points}</TableCell>
                            <TableCell className='text-right text-xl font-bold'>Not Picked</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Player</TableHead>
                        <TableHead className='text-center'>Points</TableHead>
                        <TableHead className='text-right'>Player Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {defensePlayers.map((player: any) => (
                        <TableRow key={player.player_id} className='cursor-pointer'>
                          <TableCell className='w-full flex items-end gap-3'><img src={`https://int-images.sportsnet.ca/player_headshots/NHL/280/${player.id}.png`} alt="" className='w-[70px]'/><span className='text-xl'>{player.first_name}, {player.last_name} ({player.position})</span></TableCell>
                            <TableCell className='text-center text-2xl font-bold'>{player.points}</TableCell>
                            <TableCell className='text-right text-xl font-bold'>Not Picked</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    </div>
  )
}
