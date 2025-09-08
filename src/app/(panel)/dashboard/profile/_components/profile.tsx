"use client"

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { ProfileFormData, useProfileForm } from './profile-form'

import { cn } from '@/lib/utils'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

import { Prisma } from '@/generated/prisma'
import { updateProfile } from '../_actions/update-profile'

import { formatPhone } from '@/utils/formatPhone'
import { AvatarProfile } from './profile-avatar'

type UserWithSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true
  }
}>
interface ProfileContentProps {
  user: UserWithSubscription
}

export function ProfileContent( { user }: ProfileContentProps ) {
  const form = useProfileForm({
    name: user.name,
    address: user.address,
    phone: user.phone,
    status: user.status,
    timeZone: user.timeZone,
  })

  const [ selectedHours, setSelectedHours ] = useState<string[]>( user.times ?? [])
  const [ dialogIsOpen, setDialogIsOpen ] = useState( false )

  function generateTimeSlots(): string[] {
    const hours: string[] = []

    for ( let i = 8; i <= 23; i++ ) {
      for ( let j = 0; j < 2.; j++ ) {
        const hour = i.toString().padStart(2, '0')
        const minute = ( j * 30 ).toString().padStart(2, '0')

        hours.push(`${ hour }:${ minute }`)

      }

    }

    return hours
  }

  const hours = generateTimeSlots()
  const timeZones = Intl.supportedValuesOf("timeZone").filter( zone =>
    zone.startsWith("America/Sao_Paulo") ||
    zone.startsWith("America/Fortaleza") ||
    zone.startsWith("America/Bahia") ||
    zone.startsWith("America/Recife") ||
    zone.startsWith("America/Belem") ||
    zone.startsWith("America/Manaus") ||
    zone.startsWith("America/Cuiaba") ||
    zone.startsWith("America/Boa_Vista")
  )

  function toggleHour( hour: string ) {
    setSelectedHours( prev => prev.includes( hour )
      ? prev.filter( h => h !== hour )
      : [ ...prev, hour ].sort()
    )
  }

  async function onSubmit( values: ProfileFormData ) {
    const res = await updateProfile({
      name: values.name,
      address: values.address,
      phone: values.phone,
      status: values.status === 'active' ? true : false,
      timeZone: values.timeZone,
      times: selectedHours || []
    })

    if ( res.error ) {
      toast.error( res.error )
    }

    toast.success( res.data )
  }

  return (
    <div className='mx-auto' >
      <Form { ...form } >
        <form onSubmit={ form.handleSubmit( onSubmit ) } >
          <Card>
            <CardHeader>
              <CardTitle> My Profile </CardTitle>
            </CardHeader>
              <CardContent className='space-y-6'>
              <div className='flex justify-center'>
                <AvatarProfile
                  avatarUrl={ user.image }
                  userId={ user.id }
                />
                {/* <div className='bg-gray-200 relative h-40 w-40 rounded-full overflow-hidden'>
                  <Image
                    src={ user.image ? user.image : img }
                    alt='Img Test'
                    fill
                    className='object-cover'
                  />
                </div> */}
              </div>

              <div className='space-y-4' >
                <FormField
                  control={ form.control }
                  name='name'
                  render={ ({ field }) => (
                    <FormItem>
                      <FormLabel className='font-semibold' >Name</FormLabel>
                      <FormControl>
                        <Input
                          { ...field }
                          placeholder='Type the name of your clinic... '
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  ) }
                />
                <FormField
                  control={ form.control }
                  name='address'
                  render={ ({ field }) => (
                    <FormItem>
                      <FormLabel className='font-semibold' >Address</FormLabel>
                      <FormControl>
                        <Input
                          { ...field }
                          placeholder='Type the address of your clinic... '
                        />
                      </FormControl>
                    </FormItem>
                  ) }
                />
                <FormField
                  control={ form.control }
                  name='phone'
                  render={ ({ field }) => (
                    <FormItem>
                      <FormLabel className='font-semibold' >Phone</FormLabel>
                      <FormControl>
                        <Input
                          { ...field }
                          placeholder='Type the phone... '
                          onChange={ e => {
                            // field.onChange( formatPhone( e.target.value ) )
                            const number = formatPhone( e.target.value )
                            field.onChange( number )
                          } }
                        />
                      </FormControl>
                    </FormItem>
                  ) }
                />
                <FormField
                  control={ form.control }
                  name='status'
                  render={ ({ field }) => (
                    <FormItem>
                      <FormLabel className='font-semibold' >Status</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={ field.onChange }
                          defaultValue={ field.value ? 'active' : 'inactive' }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Type the status of your clinic... ' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='active' > Active ( clinic is open ) </SelectItem>
                            <SelectItem value='inactive' > Inactive ( clinic is close ) </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  ) }
                />

                <div className='space-y-2' >
                  <Label className='font-semibold text-center' >
                    Set up clinic hours
                  </Label>

                  <Dialog open={ dialogIsOpen } onOpenChange={ setDialogIsOpen } >
                    <DialogTrigger asChild >
                      <Button variant='outline' className='w-full justify-between' >
                        Select the hour
                        <ArrowRight className='w-5 h-5' />
                      </Button>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader className='flex flex-col items-center' >
                        <DialogTitle className='font-bold' >
                          Clinic hours
                        </DialogTitle>
                        <DialogDescription>
                          Select the clinic's opening hours below.
                        </DialogDescription>
                      </DialogHeader>

                      <section className='py-4' >
                        <p className='text-sm text-muted-foreground mb-2' >
                          Click in the hours for check or uncheck
                        </p>

                        <div className='grid grid-cols-5 gap-2' >
                          { hours.map( hour => (
                            <Button
                              key={ hour }
                              variant='outline'
                              className={ cn(
                                'h-10',
                                selectedHours.includes( hour ) && 'border-2 border-emerald-500 text-primary'
                              ) }
                              onClick={ () => toggleHour( hour ) }
                            >
                              { hour }
                            </Button>
                          ) ) }
                        </div>
                      </section>

                      <Button className='w-full' onClick={ () => setDialogIsOpen( false ) } >
                        Close Modal
                      </Button>

                    </DialogContent>
                  </Dialog>
                </div>

                <FormField
                  control={ form.control }
                  name='timeZone'
                  render={ ({ field }) => (
                    <FormItem>
                      <FormLabel className='font-semibold' > Select the timeZone </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={ field.onChange }
                          defaultValue={ field.value }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Select your timezone ' />
                          </SelectTrigger>
                          <SelectContent>
                            { timeZones.map( zone => (
                              <SelectItem key={ zone } value={ zone } >
                                { zone }
                              </SelectItem>
                            ) ) }
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  ) }
                />

                <Button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400"
                >
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}