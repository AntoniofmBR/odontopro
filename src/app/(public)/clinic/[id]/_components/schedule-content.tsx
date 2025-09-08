"use client"

import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'

import { Prisma } from '@/generated/prisma'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

import { formatPhone } from '@/utils/formatPhone'

import img from "../../../../../../public/foto1.png"
import { AppointmentFormData, useAppointmentForm } from './schedule-form'
import { DateTimePicker } from './date-picker'
import { Label } from '@/components/ui/label'
import { ScheduleTimesList } from './times-list'
import { createAppointment } from '../_actions/create-appointment'

type UserWithServiceAndSubs = Prisma.UserGetPayload<{
  include: {
    subscription: true,
    services: true,
  }
}>

interface ScheduleContentProps {
  clinic: UserWithServiceAndSubs
}

export interface TimeSlot {
  time: string
  available: boolean
}

export function ScheduleContent({ clinic }: ScheduleContentProps ) {
  const form = useAppointmentForm()
  const { watch } = form

  const selectedDate = watch('date')
  const selectedServiceId = watch('serviceId')

  const [ selectedTime, setSelectedTime ] = useState('')
  const [ availableTimeSlots, setAvailableTimeSlots ] = useState<TimeSlot[]>([])
  const [ loadingSlots, setLoadingSlots ] = useState(false)

  const [ blockedTimes, setBlockedTimes ] = useState<string[]>([])

  const fetchBlockedTimes = useCallback( async ( date: Date ): Promise<string[]> => {
    setLoadingSlots( true )
    try {
      const dateString = date.toISOString().split('T')[0]
      const res = await fetch( `${ process.env.NEXT_PUBLIC_URL }/api/schedule/get-appointments?userId=${ clinic.id }&date=${ dateString }` )

      const json = await res.json()
      setLoadingSlots( false )

      return json

    } catch (err) {
      console.log( err )
      setLoadingSlots( false )
      return []
    }
  }, [ clinic.id ])

  useEffect( () => {
    if ( selectedDate ) {
      fetchBlockedTimes( selectedDate ).then( ( blocked ) => {
        setBlockedTimes( blocked )

        const times = clinic.times || []

        const finalSLots = times.map( time => ({
          time,
          available: !blocked.includes( time ),
        }) )

        const stillAvailable = finalSLots.find(
          slot => slot.time === selectedTime && slot.available
        )

        if ( !stillAvailable ) setSelectedTime('')

        setAvailableTimeSlots( finalSLots )
      } )
    }


  }, [ selectedDate, clinic.times, fetchBlockedTimes, selectedTime ] )

  async function handleRegisterAppointment( formData: AppointmentFormData ) {
    if ( !selectedTime ) return
    const res = await createAppointment({
       name: formData.name,
       email: formData.email,
       phone: formData.phone,
       time: selectedTime,
       date: formData.date,
       serviceId: formData.serviceId,
       clinicId: clinic.id,
    })

    if ( res.error ) {
      toast.error( res.error )
      return
    }

    toast.success("Appointment scheduled successfully ")
    form.reset()
    setSelectedTime('')
  }

  return (
    <div className='min-h-screen flex flex-col mb-12' >
      <div className='h-32 bg-emerald-500' />

      <section className='container mx-auto px-4 -mt-12' >
        <div className='max-w-2xl mx-auto' >
          <article className='flex flex-col items-center' >
            <div className='relative w-48 h-48 rounded-full overflow-hidden border-4 border-white mb-4' >
              <Image
                src={ clinic.image || img }
                alt='Teste'
                className='object-cover'
                fill
              />
            </div>

            <h1 className='text-2xl font-bold mb-2' >
              { clinic.name }
            </h1>

            <div className='flex items-center gap-1' >
              <MapPin className='w-5 h-5' />
              <span> { clinic.address || "Address not informed" } </span>
            </div>

          </article>
        </div>
      </section>

      <section className='max-w-3xl mx-auto w-full' >
        <Form { ...form } >
          <form
            onSubmit={ form.handleSubmit( handleRegisterAppointment ) }
            className='mx-2 space-y-6 bg-white p-6 border rounded-md shadow-sm mt-7'
          >
            <FormField
              control={ form.control }
              name='name'
              render={ ({ field }) => (
                <FormItem className='my-2' >
                  <FormLabel className='font-semibold' >
                    Full Name:
                  </FormLabel>
                  <FormControl>
                    <Input
                      id='name'
                      placeholder='Type your full name'
                      { ...field }
                    />
                  </FormControl>
                </FormItem>
              ) }
            />
            <FormField
              control={ form.control }
              name='email'
              render={ ({ field }) => (
                <FormItem className='my-2' >
                  <FormLabel className='font-semibold' >
                    Email:
                  </FormLabel>
                  <FormControl>
                    <Input
                      id='email'
                      placeholder='Type your email'
                      { ...field }
                    />
                  </FormControl>
                </FormItem>
              ) }
            />
            <FormField
              control={ form.control }
              name='phone'
              render={ ({ field }) => (
                <FormItem className='my-2' >
                  <FormLabel className='font-semibold' >
                    Phone:
                  </FormLabel>
                  <FormControl>
                    <Input
                      { ...field }
                      id='phone'
                      placeholder='(XX) XXXXX-XXXX'
                      onChange={ (e) => {
                        const formattedValue = formatPhone( e.target.value )
                        field.onChange( formattedValue )
                      } }
                    />
                  </FormControl>
                </FormItem>
              ) }
            />
            <FormField
              control={ form.control }
              name='date'
              render={ ({ field }) => (
                <FormItem className='flex items-center gap-2 space-y-1' >
                  <FormLabel className='font-semibold' >
                    Scheduling date:
                  </FormLabel>
                  <FormControl>
                    <DateTimePicker
                      initialDate={ new Date() }
                      className='w-full rounded border p-2'
                      onChange={ date => {
                        if ( date ) {
                          field.onChange( date )
                          setSelectedTime('')
                        }
                      } }
                    />
                  </FormControl>
                </FormItem>
              ) }
            />
            <FormField
              control={ form.control }
              name='serviceId'
              render={ ({ field }) => (
                <FormItem className='flex items-center gap-2 space-y-1' >
                  <FormLabel className='font-semibold' >
                    Select the Service:
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={ value => {
                        field.onChange( value )
                        setSelectedTime('')
                      } } >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        { clinic.services.map( service => (
                          <SelectItem
                            key={ service.id }
                            value={ service.id }
                          >
                            { service.name } - { `${Math.floor( service.duration / 60 )}h${ service.duration % 60 }min` }
                          </SelectItem>
                        ) ) }
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              ) }
            />

            { selectedServiceId && (
              <div className='space-y-2' >
                <Label className='font-semibold' > Available Times: </Label>
                <div className='bg-gray-100 p-4 rounded-lg' >
                  { loadingSlots ? (
                    <p> Loading hours.... </p>
                  ) : availableTimeSlots.length === 0 ? (
                    <p> No available times </p>
                  ) : (
                    <ScheduleTimesList
                      onSelectTime={ ( time ) => setSelectedTime( time ) }
                      clinicTimes={ clinic.times }
                      blockedTimes={ blockedTimes }
                      selectedTime={ selectedTime }
                      selectedDate={ selectedDate }
                      availableTimeSlots={ availableTimeSlots }
                      requiredSlots={ 
                        clinic.services.find( service => service.id === selectedServiceId ) ? Math.ceil( clinic.services.find( service => service.id === selectedServiceId )!.duration / 30 ) : 1
                       }
                    />
                  ) }
                </div>
              </div>
            ) }

            { clinic.status ?(
              <Button
                type='submit'
                className='w-full bg-emerald-500 hover:bg-emerald-400'
                disabled={ !watch('name') || !watch('email') || !watch('phone') || !watch('date') }
              >
                Make Appointment
              </Button>
            ) : (
              <p className='bg-red-500 text-white rounded-lg font-semibold text-center px-4 py-2' >
                This clinic is currently closed, please try again later.
              </p>
            ) }

          </form>
        </Form>
      </section>
    </div>
  )
}