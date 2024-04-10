import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

async function getData() {
  const res = await fetch('https://d66545a3-447c-419f-8ae8-c8d5cf427615-00-qc988hrk28sr.kirk.replit.dev/api/teams', { cache: 'no-cache' })
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export default async function Home() {
  const data = await getData()

  return (
    <div className="flex flex-col gap-1 w-full max-w-screen-2xl m-auto p-5 justify-between pt-0">
        {/* <div className="bg-secondary p-5 rounded-lg mb-5 flex flex-col gap-1">
              <h1 className="text-xl text-primary font-bold tracking-tighter">From The Developer</h1>
              <p className="text-base">
                Welcome to Luxelite Pools. This is a free hockey pool platform that I created for fun. I hope you enjoy it and if you have any feedback or suggestions, please feel free to reach out to me via my website <a href="https://www.luxelite.ca" className="text-primary font-bold">Luxelite.ca</a>
              </p>
        </div> */}
        <div className="grid grid-cols-2">
          <img src="https://wallpapercave.com/wp/wp2526418.jpg" alt="" className="rounded-l-lg shadow-inner"/>
            <div className="bg-secondary rounded-r-lg flex flex-col p-10 justify-center gap-3 shadow-inner">
              <h1 className="text-4xl text-primary font-bold tracking-tighter">Playoffs are here!</h1>
              <p className="tracking-tight">Enjoy creating your own hockey pools this playoff season all for free!</p>

              <div className="flex flex-row gap-2">
                <Link href='/create'>
                  <Button variant="default">Create My Pool</Button>
                </Link>
                <Button variant="outline">Join A Pool</Button>
              </div>
            </div>
        </div>

        <div className="flex flex-col mt-5">
          <h1 className="text-2xl text-primary font-bold tracking-tight">Teams Clinched</h1>

          <div className="grid grid-cols-5 gap-3 mt-5">
            {data.map((team: any) => (
              <Link href={`/team/${team.id}`}>
              <div className="flex flex-row items-center gap-2 bg-secondary p-3 rounded-lg shadow-inner">
                <img src={team.image_url} alt="" className="w-10 h-10"/>
                <div className="flex flex-row justify-between items-center w-full">
                  <h1 className="text-base font-semibold">{team.name}</h1>
                  <ExternalLink size={17} />
                </div>
              </div>
              </Link>
            ))}
          </div>
        </div>
    </div>
  );
}
