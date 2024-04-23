'use client'

import ResetPassword from '@/components/User/ResetPassword'
import { useSearchParams } from 'next/navigation'
import React from 'react'

export default function page() {
  const searchParams = useSearchParams();
  

  return (
    <>
    {searchParams.get('mode') === 'resetPassword' && <ResetPassword />}
    </>
  )
}
