import React, {useEffect, useState} from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import PlayerCard from '../Draft/PlayerCard';
import { UserAuth } from '@/app/firebase/AuthContext';
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
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
  

export default function ViewRoster(props: any) {
    const [defensePlayers, setDefensePlayers] = useState([]);
    const [forwardPlayers, setForwardPlayers] = useState([]);
    const [hoveredPlayer, setHoveredPlayer] = useState(null);

    const { addPlayerToRoster, checkIfPlayerIsPicked, removePlayerFromRoster } = UserAuth();

    useEffect(() => {
        if (props.selectedTeam !== '') {
            const points = props.allTeamData.players;
            const goalies = props.allTeamData.goalies;
    
            // Filter players who have played more than 5 games
            const filteredPlayers = points.filter(player => player.games_played > 13);
    
            // Separate players into groups based on their positions
            console.log(goalies);

            const defensePlayers = filteredPlayers.filter(player => player.position === "D");
            const forwardPlayers = filteredPlayers.filter(player => player.position === "F");
    
            // Sort players within each group based on their points in descending order
            const sortedDefensePlayers = defensePlayers.sort((a, b) => b.points - a.points);
            const sortedForwardPlayers = forwardPlayers.sort((a, b) => b.points - a.points);
    
            const markPlayersAsPicked = async () => {
                const pickedPlayerIds = await checkIfPlayerIsPicked(props.poolId);
    
                const updatedDefensePlayers = sortedDefensePlayers.map(player => ({
                    ...player,
                    picked: pickedPlayerIds.includes(player.id)
                }));
    
                const updatedForwardPlayers = sortedForwardPlayers.map(player => ({
                    ...player,
                    picked: pickedPlayerIds.includes(player.id)
                }));
    
                setDefensePlayers(updatedDefensePlayers);
                setForwardPlayers(updatedForwardPlayers);
            };
    
            markPlayersAsPicked();
        }
    }, [props.selectedTeam]);
    
    


    if (props.loading) return <div>Loading...</div>
    
    if (props.selectedTeam === '') return <div>Select a team</div>

    const handleMouseOver = (player: any) => {
        setHoveredPlayer(player);
    };

    const handleAddPlayer = async () => {
        const player = hoveredPlayer;
    
        if (player.picked) return toast.error('Player has already been picked');
    
        console.log('Adding player to roster', player);
    
        const response = await addPlayerToRoster(props.poolId, player);
    
        if (response.success) {
            toast.success('Player added to roster');
    
            // Update the player's picked status
            const updatedPlayer = { ...player, picked: true };
    
            // Update player list function
            const updatePlayersList = (playersList) =>
                playersList.map((p) => (p.id === updatedPlayer.id ? updatedPlayer : p));
    
            // Update defense players array
            setDefensePlayers(updatePlayersList(defensePlayers));
    
            // Update forward players array
            setForwardPlayers(updatePlayersList(forwardPlayers));
    
            if (props.fromDraft === true) {
                props.addToRoster();
            }
        } else {
            toast.error(response.error);
        }
    };

    const handleRemovePlayer = async () => {
        const response = await removePlayerFromRoster(props.poolId, hoveredPlayer);
    
        if (response.success) {
            toast.success('Player removed from roster');
    
            const updatedPlayers = (players) => players.map(player =>
                player.id === hoveredPlayer.id ? { ...player, picked: false } : player
            );
    
            setDefensePlayers(updatedPlayers(defensePlayers));
            setForwardPlayers(updatedPlayers(forwardPlayers));
        } else {
            toast.error(response.error);
        }
    }
    

    const playerButtons = () => {
        if (!hoveredPlayer) return null;

        let buttonText = 'Add to Roster';
        let onClickHandler = handleAddPlayer;
        let disabled = false;
    
        if (props.fromDraft === true) {
            if (hoveredPlayer.picked === true) {
                disabled = true;
            }
        } else if (props.fromDraft === null) {
            buttonText = hoveredPlayer.picked ? 'Remove from Roster' : 'Add to Roster';
            onClickHandler = hoveredPlayer.picked ? handleRemovePlayer : handleAddPlayer;
        }
    
        return (
            <div className='flex flex-row gap-3'>
                <AlertDialogAction disabled={disabled} onClick={onClickHandler}>{buttonText}</AlertDialogAction>
            </div>
        );
    }


  return (
    <>
    <div className="flex flex-col gap-2 mt-1">


            <div className='grid relative gap-2 items-start' style={{gridTemplateColumns: "1fr 0.35fr"}}>
                <div>
                <Table className='bg-secondary rounded-lg'>
                    <div className='p-2'>   
                    <Select >
                        <SelectTrigger className="w-[180px]">
                        <SelectValue defaultValue='Forwards' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='d'>Forwards</SelectItem>
                            <SelectItem value='5'>Defence</SelectItem>
                            <SelectItem value='1'>Goalies</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>
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
                                        <TableRow onMouseOver={() => handleMouseOver(player)} className={player.picked ? `border-b-2 border-background cursor-not-allowed bg-destructive hover:bg-destructive` : `border-b-2 border-background cursor-pointer`}>
                                        <TableCell>{player.first_name} {player.last_name}</TableCell>
                                        <TableCell>{player.position}</TableCell>
                                        <TableCell>{player.points}</TableCell>
                                    </TableRow>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>{player.picked ? <>Remove {player.first_name} {player.last_name}?</> : <>Add {player.first_name} {player.last_name}?</> }</AlertDialogTitle>
                                        <AlertDialogDescription asChild>
                                        <div className='relative bg-muted p-1 rounded-lg shadow-2xl'>
                                            <div className='p-1 bg-background rounded-lg shadow-inner'>
                                                {hoveredPlayer && <PlayerCard player={hoveredPlayer}/> }
                                            </div>
                                        </div>
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        {playerButtons()}
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                            )
                        })}
                    </TableBody>
                </Table>
                </div>
                <div className='relative bg-muted p-1 rounded-lg shadow-2xl'>
                    <div className='p-1 bg-background rounded-lg shadow-inner'>
                        {hoveredPlayer && <PlayerCard player={hoveredPlayer}/> }
                    </div>
                </div>
            </div>

            

    </div>
    </>
  )
}
