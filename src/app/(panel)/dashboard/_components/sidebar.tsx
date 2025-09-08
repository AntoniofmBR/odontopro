'use client'

import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import {
  Banknote,
  CalendarCheck2,
  ChevronLeft,
  ChevronRight,
  Folder,
  List,
  LogOut,
  User,
} from 'lucide-react';
import { ReactNode, useState } from 'react';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'


import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';

import logo from '../../../../../public/logo-odonto.png'

interface SidebarLink {
  href: string
  icon: React.ReactNode
  label: string
  path: string
  isCollapsed: boolean
}

function SidebarLink({ href, icon, label, path, isCollapsed }: SidebarLink ) {
  return (
    <Link
      href={ href }
    >
      <div className={ clsx(
        "flex item-center gap-2 px-3 py-2 rounded-md transition-colors",
        path === href ? "text-white bg-blue-500" : "text-gray-700 hover:bg-gray-100"
      ) } >
        <span className='w-6 h-6' >{ icon }</span>
        { !isCollapsed && <span>{ label }</span> }
      </div>
    </Link>
  )
}


export function Sidebar({ children }: { children: ReactNode } ) {
  const path = usePathname()
  const [ isCollapsed, setIsCollapsed ] = useState(false)

  const { update } = useSession()
  const router = useRouter()

  const links = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: <CalendarCheck2 className='w-6 h-6' />,
    },
    {
      href: '/dashboard/services',
      label: 'Services',
      icon: <Folder className='w-6 h-6' />,
    },
    {
      href: '/dashboard/profile',
      label: 'My Profile',
      icon: <User className='w-6 h-6' />,
    },
    {
      href: '/dashboard/plans',
      label: 'Plans',
      icon: <Banknote className='w-6 h-6' />,
    },
  ]

  async function handleLogout() {
      await signOut()
      await update()
  
      router.replace('/')
    }
  

  return (
    <div className='flex min-h-screen w-full' >
      <aside className={ clsx(
        "flex flex-col justify-between border-r bg-background transition-all duration-300 p-4 h-full",
        isCollapsed ? "w-20" : "w-64",
        "hidden md:flex md:fixed",
      )}
      >
        <div>
          <div className='mb-6 mt-4' >
          { !isCollapsed && (
              <Image
              src={ logo }
              alt='Logo'
              priority
              quality={ 100 }
            />
          ) }
        </div>

        <Button
          className='bg-gray-100 hover:bg-gray-50 text-zinc-900 self-end mb-2'
          onClick={ () => setIsCollapsed( !isCollapsed ) }
        >
          {
            isCollapsed
            ? <ChevronRight className='w-12 h-12' />
            : <ChevronLeft className='w-12 h-12' /> 
          }
        </Button>

        { isCollapsed && (
          <nav className='flex flex-col gap-1 overflow-hidden mt-2' >
              { links.map( link => (
                  <SidebarLink
                    key={ link.label }
                    href={ link.href }
                    icon={ link.icon }
                    label={ link.label }
                    isCollapsed={ isCollapsed }
                    path={ path }
                  />
                ) ) }
          </nav>
        ) }

        <Collapsible open={ !isCollapsed }>
          <CollapsibleContent>
            <nav className='flex flex-col gap-1 overflow-hidden' >
              <span className='text-sm text-gray-400 font-medium mt-1 uppercase' >
                Painel
              </span>

              { links.slice( 0, 2 ).map( link => (
                  <SidebarLink
                    key={ link.label }
                    href={ link.href }
                    icon={ link.icon }
                    label={ link.label }
                    isCollapsed={ isCollapsed }
                    path={ path }
                  />
                ) ) }

              <span className='text-sm text-gray-400 font-medium mt-1 uppercase' >
                Settings
              </span>
              { links.slice( 2, links.length ).map( link => (
                  <SidebarLink
                    key={ link.label }
                    href={ link.href }
                    icon={ link.icon }
                    label={ link.label }
                    isCollapsed={ isCollapsed }
                    path={ path }
                  />
                ) ) }
            </nav>
          </CollapsibleContent>
        </Collapsible>
        </div>

        { isCollapsed ? (
          <section className='mt-4' >
          <Button
            variant='destructive'
            onClick={ handleLogout }
          >
            <LogOut />
          </Button>
        </section>
        ) : (
          <section className='mt-4' >
            <Button
              variant='destructive'
              onClick={ handleLogout }
              className='w-full'
            >
              <LogOut />
              Logout
            </Button>
        </section>
        ) }
      </aside>


      <div className={ clsx(
      "flex flex-1 flex-col transition-all duration-300",
      isCollapsed ? "md:ml-20" : "md:ml-64",
      )} >
        <header className='md:hidden flex items-center justify-between border-b px-2 md:px-6 h-14 z-10 sticky top-0 bg-white ' >
          <Sheet>
            <div className='flex items-center gap-4' >
              <SheetTrigger asChild >
                <Button
                  variant='outline'
                  size='icon'
                  className='md:hidden'
                  onClick={ () => setIsCollapsed(false) }
                >
                  <List className='w-5 h-5' />
                </Button>
              </SheetTrigger>

              <h1 className='text-base md:text-lg font-semibold' >
                Menu OdontoPro
              </h1>

            </div>

            <SheetContent side='right' className='sm:max-w-xs text-black p-5' >
              <SheetTitle> OdontoPRO </SheetTitle>
              <SheetDescription>
                Administrative Menu
              </SheetDescription>

              <nav className='grid gap-2 text-base pt-5' >
                { links.map( link => (
                  <SidebarLink
                    key={ link.label }
                    href={ link.href }
                    icon={ link.icon }
                    label={ link.label }
                    isCollapsed={ isCollapsed }
                    path={ path }
                  />
                ) ) }
              </nav>
                <section className='mt-4' >
                  <Button
                    variant='destructive'
                    onClick={ handleLogout }
                    className='w-full'
                  >
                    <LogOut />
                    Logout
                  </Button>
              </section>
            </SheetContent>
          </Sheet>
        </header>

        <main className='flex-1 py-4 px-2 md:p-6' >
          { children }
        </main>
      </div>
    </div>
  )
}