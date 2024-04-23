'use client'
import Image from "next/image"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  Home,
  LineChart,
  ListFilter,
  LogOutIcon,
  MailIcon,
  MoreVertical,
  Package,
  Package2,
  PanelLeft,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Users2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import PoolChat from "@/components/Pool/PoolChat"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { UserAuth } from "../firebase/AuthContext"

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


  return (
    <div className="bg-muted/40 p-4 h-[90vh]">
    <div className="flex flex-col w-full max-w-screen-2xl m-auto">
      <div className="flex flex-col sm:gap-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-3 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-3 lg:col-span-2 h-full relative">
            <div className="flex">
              <Card
                className="w-full" x-chunk="dashboard-05-chunk-0"
              >
                <CardHeader className="pb-3 bg-muted/50 rounded-t-md">
                  <CardTitle>
                      <div className="flex flex-row gap-4 items-center">
                        <Avatar className='w-24 h-24'>
                        <AvatarImage src="https://firebasestorage.googleapis.com/v0/b/storeapp-47c29.appspot.com/o/pool_images%2F77c1a876-27f4-4610-bdf1-e19f8ab4dc0d?alt=media&token=0c01b4d3-46fc-40ed-bcbf-f165117f2907"/>
                        </Avatar>

                        <h1 className="text-3xl tracking-tighter">The Bedards</h1>
                      </div>
                    </CardTitle>
                  <CardDescription className="max-w-3xl text-balance leading-relaxed">
                    Welcome to the pool dashboard, view your pool stats and invite friends to join.
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex flex-row gap-2 pt-5 justify-between">
                  <div className="gap-2 flex">
                    <Button size="sm" variant="outline" className="h-8 gap-2">
                      <MoreVertical className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 gap-2">
                      <MailIcon className="h-3.5 w-3.5" /><span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">Invite Members</span>
                    </Button>
                  </div>
                  <Button size="sm" variant="destructive" className="h-8 gap-2">
                    <LogOutIcon className="h-3.5 w-3.5" /><span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">Leave Pool</span>
                  </Button>
                </CardFooter>
              </Card>

            </div>
            <Tabs defaultValue="chat">
              <div className="flex items-center">
                <TabsList>
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                  <TabsTrigger value="leaders">Leaderboard</TabsTrigger>
                  <TabsTrigger value="rosters">Rosters</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="chat" className="h-full">
                <PoolChat chat_id={poolData.chat_id} pool_id={poolData.poolID}/>
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <Card
              className="overflow-hidden" x-chunk="dashboard-05-chunk-4"
            >
              <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                  <CardTitle className="group flex items-center gap-2 text-lg">
                    Order Oe31b70H
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Copy className="h-3 w-3" />
                      <span className="sr-only">Copy Order ID</span>
                    </Button>
                  </CardTitle>
                  <CardDescription>Date: November 23, 2023</CardDescription>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <Button size="sm" variant="outline" className="h-8 gap-1">
                    <Truck className="h-3.5 w-3.5" />
                    <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                      Track Order
                    </span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="outline" className="h-8 w-8">
                        <MoreVertical className="h-3.5 w-3.5" />
                        <span className="sr-only">More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Export</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Trash</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
            </Card>
          </div>
        </main>
      </div>
    </div>
    
    </div>
  )
}
