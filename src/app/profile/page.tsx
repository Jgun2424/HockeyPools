'use client'

import { useState } from "react"
import MyPools from "@/components/MyPools"
import UserSettings from "@/components/UserSettings"

export default function page() {
  const [Selected, setSelected] = useState("profile")
  const [selectedClass, setSelectedClass] = useState("font-semibold text-primary")




  return (
    <div className="flex w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-screen-2xl gap-2 pr-5 pl-5">
          <h1 className="text-3xl font-semibold">Account Area</h1>
        </div>
        <div className="mx-auto grid w-full max-w-screen-2xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr] pr-5 pl-5">
          <nav
            className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0"
          >
            <span className={Selected === 'profile' ? selectedClass : 'cursor-pointer'} onClick={() => setSelected('profile')}>
              Profile
            </span>
            <span onClick={() => setSelected('pools')} className={Selected === 'pools' ? selectedClass : 'cursor-pointer'}>
              My Pools
            </span>
          </nav>
            {Selected === "profile" ? <UserSettings /> : null}
            {Selected === "pools" ? <MyPools /> : null}
        </div>
      </main>
    </div>
  )
}
