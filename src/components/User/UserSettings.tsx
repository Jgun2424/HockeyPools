'use client'

import React, {useEffect, useState} from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { UserAuth } from '../../app/firebase/AuthContext'
import { toast } from 'sonner'

export default function UserSettings() {
    const { userData, user, loading, sendPasswordReset } = UserAuth()
    const [data, setData] = useState(null)
    const [passwordResetSent, setPasswordResetSent] = useState(false)


    useEffect(() => {
      if (loading === false) {
        if (user) {
          setData(userData)
          console.log(userData)
        }
      }
    }
  , [loading])

  const handlePasswordReset = async () => {
    if (user) {
      sendPasswordReset(data?.email)
      setPasswordResetSent(true)
      toast.success('Password reset link sent to your email')
    }
  }


  return (
    <div className="grid gap-3">
    <Card>
      <CardHeader>
        <CardTitle>Email</CardTitle>
        <CardDescription>
          This is the email address associated with your account. This cannot be changed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <Input defaultValue={data?.email} disabled/>
        </form>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Username</CardTitle>
        <CardDescription>
        This is the username associated with your account. This cannot be changed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <Input defaultValue={data?.username} disabled/>
        </form>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>
            You can change your password here.
        </CardDescription>
      </CardHeader>
      <CardFooter className="border-t px-6 py-4">
        <Button onClick={() => handlePasswordReset()} disabled={passwordResetSent}>Send reset link</Button>
      </CardFooter>
    </Card>


  </div>
  )
}
