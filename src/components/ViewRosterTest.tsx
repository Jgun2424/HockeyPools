import React, {useEffect, useState} from 'react'
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { StarIcon, StarsIcon } from 'lucide-react';
import { Icon } from '@iconify/react';
import PlayerCard from './PlayerCard';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import PlayerCardTest from './PlayerCardTest';
import Confetti from 'react-confetti'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"
  

export default function ViewRoster(props: any) {
    const [defensePlayers, setDefensePlayers] = useState([]);
    const [forwardPlayers, setForwardPlayers] = useState([]);
    const [mouseOver, setMouseOver] = useState(false);
    const [hoveredPlayer, setHoveredPlayer] = useState(null);

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

    const handleMouseOver = (player: any) => {
        setHoveredPlayer(player);
    };

  return (
    <>
    <div className="flex flex-col gap-2 mt-1">
        {/* <h1 className="text-2xl font-bold text-primary">Forwards</h1>
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
            </div> */}


            <div className='grid relative gap-2 items-start' style={{gridTemplateColumns: "1fr 0.35fr"}}>
                <Table className='bg-secondary rounded-lg'>
                    <TableHeader className='border-b-2 border-background'>
                        <TableRow>
                            <TableHead>Player</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Points</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {forwardPlayers.map((player: any, index: number) => {
                            return (
                                    <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <TableRow onMouseOver={() => handleMouseOver(player)} className='border-b-2 border-background cursor-pointer'>
                                        <TableCell>{player.first_name} {player.last_name}</TableCell>
                                        <TableCell>{player.position}</TableCell>
                                        <TableCell>{player.points}</TableCell>
                                    </TableRow>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Add {player.first_name} {player.last_name}?</AlertDialogTitle>
                                        <AlertDialogDescription asChild>
                                        <div className='relative bg-muted p-1 rounded-lg shadow-2xl'>
                                            <div className='p-1 bg-background rounded-lg shadow-inner'>
                                                {hoveredPlayer && <PlayerCardTest player={hoveredPlayer}/> }
                                            </div>
                                        </div>
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction>Add Player To Roster</AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                            )
                        })}
                    </TableBody>
                </Table>
                {/* <div className='flex flex-col gap-3'>
                {forwardPlayers.map((player: any, index: number) => {
                    return (
                        <div onMouseOver={() => handleMouseOver(player)} className='p-3 bg-muted rounded-sm'>{player.first_name}</div>
                    )
                }
                )}
                </div> */}
                <div className='relative bg-muted p-1 rounded-lg shadow-2xl'>
                    <div className='p-1 bg-background rounded-lg shadow-inner'>
                        {hoveredPlayer && <PlayerCardTest player={hoveredPlayer}/> }
                    </div>
                </div>
            </div>

            

    </div>
    </>
  )
}
