import React from 'react'
import { SignIn } from '@clerk/nextjs'
import { Metadata } from 'next'

export const metadata:Metadata ={
    title: "NoteGenie SignIn"
} 
const SignInPage = () => {
  return (
    <div className='flex h-screen items-center justify-center'>
      <SignIn appearance={{ variables: { colorPrimary: "#0F1724"}}}/>
    </div>
  )
}

export default SignInPage
