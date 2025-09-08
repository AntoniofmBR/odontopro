'use client'

import { toast } from 'sonner'
import { Plus, Trash } from 'lucide-react'
import { useState } from 'react'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

import { Reminder } from '@/generated/prisma'
import { deleteReminder } from '../../_actions/delete-reminder'
import { ReminderDialogForm } from './reminder-dialog-form'

interface ReminderProps {
  reminders: Reminder[]
}

export function ReminderList({ reminders }: ReminderProps ) {
  const [ isDialogOpen, setIsDialogOpen ] = useState(false)

  async function handleDeleteReminder( reminderId: string ) {
    const res = await deleteReminder( { reminderId } )

    if ( res.error ) {
      toast.error( res.error )
      return
    }

    toast.success( res.data )
  }

  return (
    <div className='flex flex-col gap-3' >
      <Card>
        <CardHeader className='flex items-center justify-between space-y-0 pb-2' >
          <CardTitle className='text-xl md:text-2xl font-bold' >
            Reminders
          </CardTitle>

          <Dialog open={ isDialogOpen } onOpenChange={ setIsDialogOpen } >
            <DialogTrigger asChild >
              <Button
                variant='ghost'
                className='w-9 p-0'
              >
                <Plus className='w-5 h-5' />
              </Button>
            </DialogTrigger>

            <DialogContent className='max-w-96' >
              <DialogHeader className='flex items-center' >
                <DialogTitle className='font-bold' > New Reminder </DialogTitle>
                <DialogDescription>
                  Create a new reminder for your list.
                </DialogDescription>
              </DialogHeader>

              <ReminderDialogForm closeDialog={ () => setIsDialogOpen(false) } />
            </DialogContent>
          </Dialog>

        </CardHeader>
        { reminders.length > 0 ? (
          <CardContent>
            <ScrollArea className='h-80 lg:max-h-[ calc( 100vh - 15rem ) ] pr-0 w-full flex-1' >
              { reminders.map( reminder => (
                <article
                  key={ reminder.id }
                  className='flex flex-wrap flex-row items-center justify-between py-2 bg-yellow-100 mb-2 px-4 rounded-md'
                >
                  <p className='text-xs lg:text-base' >
                    { reminder.description }
                  </p>
                  <Button
                    className='bg-red-500 hover:bg-red-400 shadow-none rounded-full p-2'
                    size='sm'
                    onClick={ () => handleDeleteReminder( reminder.id ) }
                  >
                    <Trash className='w-5 h-5 text-white' />
                  </Button>
                </article>
              ) ) }
              </ScrollArea>
          </CardContent>
        ) : (
          <CardContent>
            <p>
              No Reminders, try adding some.
            </p>
          </CardContent>
        ) }
      </Card>
    </div>
  )
}