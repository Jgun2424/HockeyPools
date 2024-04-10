'use client'
import React, { useState } from 'react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from './ui/input'
import { useSearchParams } from 'next/navigation'
import { UserAuth } from '../app/firebase/AuthContext';
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const passwordToken = searchParams.get('oobCode');
  const { passwordReset } = UserAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords don't match");
      return;
    }

    try {
      const passwordResult = await passwordReset(passwordToken, newPassword);

        if (passwordResult.success) {
            toast.success('Password reset successfully');
            router.push('/login');
        } else {
            setErrorMessage(passwordResult.error.replace('Firebase:', ''));
        }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className='flex flex-col gap-1 w-full max-w-screen-lg m-auto p-5 justify-between pt-5'>
      <h1 className="text-2xl font-semibold mb-4">Reset Password</h1>
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      <div className="flex flex-col w-full gap-3">
        <Input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button
            variant='default'
          onClick={handleResetPassword}
        >
          Reset Password
        </Button>
      </div>
    </div>
  );
}
