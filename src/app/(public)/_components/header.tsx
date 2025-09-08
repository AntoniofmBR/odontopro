'use client'

import Link from 'next/link';
import { LogIn, Menu } from 'lucide-react';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetHeader,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { handleRegister } from '../_actions/login';

export function Header() {
  const { data: session, status } = useSession()
  const [ isOpen, setIsOpen ] = useState(false)

  const navItems = [
    { href: "#profissionais", label: "Professionals" },
  ]

  async function handleLogin() {
    await handleRegister("google" )
  }

  function NavLinks() {
    return (
      <>
        { navItems.map( item => (
          <Button
            key={ item.href }
            asChild
            className='bg-transparent hover:bg-transparent text-black shadow-none'
            onClick={ () => setIsOpen(false) }
          >
            <Link href={ item.href } >
              { item.label }
            </Link>
          </Button>
        ) ) }

        { status === 'loading' ? (
          <></>
        ) : session ? (
          <Link href='/dashboard' className='flex items-center justify-center gap-2 bg-zinc-900 text-white py-1 px-4 rounded-md' >
            Access Clinic
          </Link>
        ) : (
          <Button onClick={ handleLogin } >
           <LogIn /> Login
          </Button>
        ) }
      </>
    )
  }

  return (
    <header className='fixed top-0 right-0 left-0 z-[999] py-4 px-6 bg-white' >
      <div className='container mx-auto flex items-center justify-between' >
  
        <Link href='/' className='text-3xl font-bold text-zinc-900' >
          Odonto<span className='text-emerald-500' >PRO</span>
        </Link>

        <nav className='hidden md:flex items-center space-x-4' >
          <NavLinks />
        </nav>

        <Sheet open={ isOpen } onOpenChange={ setIsOpen } >
          <SheetTrigger asChild className='md:hidden' >
            <Button
              className='text-black hover:bg-transparent'
              variant='ghost'
              size='icon'
            >
              <Menu className='w-6 h-6' />
            </Button>
          </SheetTrigger>

          <SheetContent side='right' className='w-[240px] sm:w-[300px] z-[9999] p-5' >
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>
              See our links
            </SheetDescription>
            <SheetHeader />

            <nav className='flex flex-col space-y-4 mt-6' >
              <NavLinks />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}