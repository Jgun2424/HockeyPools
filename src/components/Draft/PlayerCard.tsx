import React, {useEffect, useState} from 'react'
import { Card } from '../ui/card';
import { Separator } from '../ui/separator';
import { Icon } from '@iconify/react';
import { Progress } from "@/components/ui/progress"


export default function ViewRoster(props: any) {

    const player = props.player;
    const [scoringFrequency, setScoringFrequency] = useState(0);
    const [assistPercentage, setAssistPercentage] = useState(0);
    const [overallStrength, setOverallStrength] = useState(0);

    useEffect(() => {
        if (player) {
            playerGoalPercentage();
            playerAssistPercentage();
            calculateOverallStrength();
        }
    }, [player])


    const playerStarRaningGenerator = (player: any) => {

        if (player.position === "D") {
            const starsCount = Math.min(Math.ceil(player.points / 12), 5); // Calculate stars count based on player's points, with a maximum of 5 stars
    
            const filledStars = Array.from({ length: starsCount }, (_, index) => (
                <span key={index} className='text-2xl'><Icon icon="gravity-ui:star-fill" color='ffac33'/></span>
            ));
    
            return [...filledStars];
        }

        if (player.position === "F") {
            const starsCount = Math.min(Math.ceil(player.points / 20), 5); // Calculate stars count based on player's points, with a maximum of 5 stars
    
            const filledStars = Array.from({ length: starsCount }, (_, index) => (
                <span key={index} className='text-2xl'><Icon icon="gravity-ui:star-fill" color='ffac33'/></span>
            ));

    
            return [...filledStars];
        }
    }
            


    const playerGoalPercentage = () => {
        const pointsPerGame = parseFloat(player.points_per_game);
        const goals = player.goals;
        const normalizedGoals = (goals / 38) * 100; 
        const expectedPoints = pointsPerGame * player.games_played / 5
        const normalizedPoints = (expectedPoints / (player.games_played * 2)) * 50; 
        const scoringFrequency = (normalizedGoals + normalizedPoints) / 2;
        
        setScoringFrequency(scoringFrequency);
        return scoringFrequency;
    };


    const playerAssistPercentage = () => {
        const normalizedAssists = (player.assists / 105) * 100;
        const assistPercentage = normalizedAssists;

        setAssistPercentage(assistPercentage);
        return assistPercentage;
    }

    const calculateOverallStrength = () => {
        const goalPercentage = playerGoalPercentage();
        const assistPercentage = playerAssistPercentage();
        const pointsPerGameScore = parseFloat(player.points_per_game);
        let overallStrength = (0.65 * goalPercentage + 0.65 * assistPercentage + 0.65 * pointsPerGameScore) ;
        overallStrength = Math.min(Math.max(overallStrength, 0), 100);
        setOverallStrength(overallStrength);
        return overallStrength;
    };


  return (

                <Card className="bg-muted h-[500px] rounded-sm p-2 relative overflow-hidden hover:scale-[1.02] transition-all cursor-pointer">
                    <div className='absolute z-50 left-3 top-1'>
                        <span className='text-xl font-bold text-muted-foreground'>•</span>
                    </div>
                    <div className='absolute z-50 right-3 top-1'>
                        <span className='text-xl font-bold text-muted-foreground'>•</span>
                    </div>
                    <div className='absolute z-50 left-3 bottom-1'>
                        <span className='text-xl font-bold text-muted-foreground'>•</span>
                    </div>
                    <div className='absolute z-50 right-3 bottom-1'>
                        <span className='text-xl font-bold text-muted-foreground'>•</span>
                    </div>
                    <div className='absolute bg-muted p-4 w-[100px] rotate-[-40deg] -left-10 z-10 shadow-md'></div>
                    <div className='absolute bg-muted p-4 w-[100px] rotate-[40deg] -right-10 z-10 shadow-md'></div>
                    <div className='absolute bg-muted p-4 w-[100px] rotate-[40deg] bottom-0 -left-9 z-10 shadow-lg'></div>
                    <div className='absolute bg-muted p-4 w-[100px] rotate-[-40deg] bottom-0 -right-10 z-10 shadow-lg'></div>
                    <div className='flex flex-col h-full bg-muted shadow-inner relative'>

                            <div className='flex flex-col justify-center items-center absolute w-full z-30 top-2'>
                                <div className='flex flex-row gap-3'>
                                    {player && playerStarRaningGenerator(player)}
                                </div>
                            </div>

                        {/* player card area */}
                        <div className='relative overflow-hidden h-[900px]'>
                            <img src={`https://int-images.sportsnet.ca/player_headshots/NHL/280/${player.id}.png`} alt="" className='absolute w-[200px] left-0 -bottom-3 z-20 rounded-3xl'/>
                            <img src={`https://images.rogersdigitalmedia.com/www.sportsnet.ca/team_logos/200x200/hockey/nhl/${player.team_name_formatted.replaceAll(" ", "-").toLowerCase()}.png`} alt="" className='absolute w-[250px] right-0 -bottom-2 z-10 opacity-60'/>
                        </div>
                        <Separator className='bg-muted h-2'/>

                        <div className='w-full h-full relative flex flex-col z-0 overflow-hidden rounded-t-2xl'>
                            <div className='bg-muted-foreground w-full h-full opacity-10 flex flex-col z-0 absolute'></div>

                            <div className='flex flex-col p-2'>
                                <div className='flex flex-row justify-center gap-1'>
                                    <span className='tracking-tighter font-semibold text-xl text-secondary-foreground'>{player.first_name}</span>
                                    <span className='tracking-tighter font-semibold text-xl text-secondary-foreground'>{player.last_name}</span>
                                </div>

                                <div className='flex flex-col p-3 pt-0'>
                                    <div className='flex flex-col'>
                                        <span className='text-sm text-secondary-foreground'>Scoring</span>
                                        <Progress value={scoringFrequency} className='h-2' defaultValue={0}/>
                                    </div>
                                    <div className='flex flex-col'>
                                        <span className='text-sm text-secondary-foreground'>Passing</span>
                                        <Progress value={assistPercentage} className='h-2'/>
                                    </div>
                                    <div className='flex flex-col'>
                                        <span className='text-sm text-secondary-foreground'>Overall</span>
                                        <Progress value={overallStrength} className='h-2'/>
                                    </div>

                                </div>
                            </div>
                        </div>
                        

                    </div>
                </Card>
  )
}
