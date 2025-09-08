'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { X, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'

import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'

import { Prisma } from '@/generated/prisma'
import { cancelAppointments } from '../../_actions/cancel-appointments'
import { DialogAppointment } from './dialog-appointment'
import { ButtonPickerDate } from './button-date'

interface AppointmentsListProps {
  times: string[]
}

export type AppointmentWithService = Prisma.AppointmentGetPayload<{
  include: {
    service: true,
  }
}>

export function AppointmentsList( { times }: AppointmentsListProps ) {
  const [ isDialogOpen, setIsDialogOpen ] = useState( false )
  const [ detailAppointment, setDetailAppointment ] = useState< AppointmentWithService | null >( null )

  const searchParams = useSearchParams()
  const date = searchParams.get('date')
  const queryClient = useQueryClient()

  const { data, isLoading, refetch } = useQuery({
    queryKey: [ 'get-appointments', date ],
    queryFn: async () => {

      let activeDate = date

      if ( !activeDate ) {
        const today = format( new Date(), 'yyyy-MMM-dd' )
        activeDate = today
      }

      const url = `${ process.env.NEXT_PUBLIC_URL }/api/clinic/appointments?date=${ date }`

      const res = await fetch( url )
      const json = await res.json() as AppointmentWithService[]

      if ( !res.ok ) { return [] }
      return json
    },
    staleTime: 20000, // 20 seconds
    refetchInterval: 60000, // 60 seconds
  })

  const occupantMap: Record<string, AppointmentWithService> = {}

  if ( data && data.length > 0 ) {
    for ( const appointment of data ) {
      const requiredSlots = Math.ceil( appointment.service.duration / 30 )
      const startIndex = times.indexOf( appointment.time )

      if ( startIndex !== -1 ) {
        for ( let i = 0; i < requiredSlots; i++ ) {
          const slotIndex = startIndex + i

          if ( slotIndex < times.length ) {
            occupantMap[ times[ slotIndex ] ] = appointment
          }

        }
      }
    }
  }

  async function handleCancelAppointment( appointmentId: string ) {
    const res = await cancelAppointments( { appointmentId } )

    if ( res.error ) {
      toast.error( res.error )
      return
    }

    queryClient.invalidateQueries({ queryKey: [ 'get-appointments' ] })
    await refetch()
    toast.success( res.data )
  }

  return (
    <Dialog open={ isDialogOpen } onOpenChange={ setIsDialogOpen } >
      <Card>
        <CardHeader className='flex items-center justify-between space-y-0 pb-2' >
          <CardTitle className='text-xl md:text-2xl font-bold' >
            Appointments
          </CardTitle>
          <button>
            <ButtonPickerDate />
          </button>
        </CardHeader>

        <CardContent>
          <ScrollArea className='h-[ calc( 100vh - 20rem ) ] lg:h-[ calc( 100vh - 15rem ) ] pr-4' >
            { isLoading ? (
              <p>
                Loading...
              </p>
            ) : (
              times.map( time => {
                const occupant = occupantMap[ time ]

                if ( occupant ) {
                  return (
                    <div
                      key={ time }
                      className='flex items-center py-2 border-t last:border-b '
                    >
                      <div className='w-16 text-sm font-semibold' >
                        { time }
                      </div>

                      <div className='flex-1 text-sm' >
                        <div className='font-semibold' >
                          { occupant.name }
                        </div>
                        <div className='text-sm text-gray-500' >
                          { occupant.service.name }
                        </div>
                      </div>

                      <div className='ml-auto' >
                        <div className='flex' >
                          <DialogTrigger asChild >
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={ () => setDetailAppointment( occupant ) }
                            >
                              <Eye className='w-4 h-4' />
                            </Button>
                          </DialogTrigger>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={ () => handleCancelAppointment( occupant.id ) }
                          >
                            <X className='w-4 h-4' />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                }

                return (
                  <div
                    key={ time }
                    className='flex items-center py-2 border-t last:border-b '
                  >
                    <div className='w-16 text-sm font-semibold' >
                      { time }
                    </div>
                    <div className='flex-1 text-sm text-gray-500' >
                      Available
                    </div>
                  </div>
                )
              } )
            ) }
          </ScrollArea>
        </CardContent>
      </Card>

      <DialogAppointment appointment={ detailAppointment } />
    </Dialog>
  )
}