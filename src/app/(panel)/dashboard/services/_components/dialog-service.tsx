"use client"

import { useState } from 'react'
import { toast } from 'sonner'

import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { convertRealToCents } from '@/utils/convertCurrency'

import { DialogServiceFormData, useDialogServiceForm } from './dialog-service-form'
import { createNewService } from '../_actions/createService'
import { updateService } from '../_actions/updateService'

interface DialogServiceProps {
  handleCloseModal: () => void
  serviceId?: string
  initialValues?: {
    name: string
    price: string
    hours: string
    minutes: string
  }
}

export function DialogService( { handleCloseModal, initialValues, serviceId }: DialogServiceProps ) {
  const form = useDialogServiceForm({ initialValues })

  const [ isLoading, setIsLoading ] = useState(false)

  async function onSubmit( values: DialogServiceFormData ) {
    setIsLoading(true)

    const priceInCents = convertRealToCents( values.price )
    const hours = parseInt( values.hours ) || 0
    const minutes = parseInt( values.minutes ) || 0

    const durationInMinutes = ( hours * 60 ) + minutes

    if ( serviceId ) {
      await editServiceById({
        serviceId,
        name: values.name,
        priceInCents,
        duration: durationInMinutes,
      })
      return
    }

    const res = await createNewService({
      name: values.name,
      price: priceInCents,
      duration: durationInMinutes,
    })
    setIsLoading(false)

    if ( res.error ) {
      toast.error( res.error )
      return
    }

    toast.success( res.message )
    closeModal()
  }

  async function editServiceById({
    serviceId,
    name,
    priceInCents,
    duration
  }: {
    serviceId: string,
    name: string,
    priceInCents: number,
    duration: number,
  }) {

    const res = await updateService({
      serviceId,
      name,
      price: priceInCents,
      duration,
    })

    setIsLoading( false )

    if ( res.error ) {
      toast.error( res.error )
      return
    }

    toast.success( res.message )
    closeModal()

  }

  function closeModal() {
    form.reset()
    handleCloseModal()
  }

  function changeCurrency( event: React.ChangeEvent< HTMLInputElement > ) {
    let { value } = event.target

    value = value.replace( /\D/g, '' )

    if ( value ) {
      //? Value in cents / 100 = value in real
      value = ( parseInt( value,10 ) / 100 ).toFixed(2)
      value = value.replace( '.', ',' )
      value = value.replace( /\B(?=(\d{3})+(?!\d))/g, '.' )
    }

    event.target.value = value
    form.setValue('price', value)
  }

  return (
    <>
      <DialogHeader className='flex flex-col items-center' >
        <DialogTitle className='font-bold' >
          { serviceId ? "Editing Service" : "New Service" }
        </DialogTitle>
        <DialogDescription>
          { serviceId ? `Editing service ${ initialValues!.name }` : "Add a new service" }
        </DialogDescription>
      </DialogHeader>

      <Form { ...form } >
        <form
          className='space-y-2'
          onSubmit={ form.handleSubmit( onSubmit ) }
         >
          <div className='flex flex-col' >
            <FormField
              control={ form.control }
              name='name'
              render={ ({ field }) => (
                <FormItem className='my-2' >
                  <FormLabel className='font-semibold' >
                    Service Name
                  </FormLabel>
                  <FormControl>
                    <Input { ...field } placeholder='Type the service name' />
                  </FormControl>
                </FormItem>
              ) }
            />

            <FormField
              control={ form.control }
              name='price'
              render={ ({ field }) => (
                <FormItem className='my-2' >
                  <FormLabel className='font-semibold' >
                    Service Price
                  </FormLabel>
                  <FormControl>
                    <Input
                      { ...field }
                      placeholder='Type the service price'
                      onChange={ changeCurrency }
                    />
                  </FormControl>
                </FormItem>
              ) }
            />

            <p className='font-semibold' >
              Service duration
            </p>
          <div className='grid grid-cols-2 gap-3' >
              <FormField
                control={ form.control }
                name='hours'
                render={ ({ field }) => (
                  <FormItem className='my-2' >
                    <FormLabel className='font-semibold' >
                      Hours:
                    </FormLabel>
                    <FormControl>
                      <Input
                        { ...field }
                        placeholder='1'
                        min='0'
                        type='number'
                      />
                    </FormControl>
                  </FormItem>
                ) }
              />

              <FormField
                control={ form.control }
                name='minutes'
                render={ ({ field }) => (
                  <FormItem className='my-2' >
                    <FormLabel className='font-semibold' >
                      Minutes:
                    </FormLabel>
                    <FormControl>
                      <Input
                        { ...field }
                        placeholder='0'
                        min='0'
                        type='number'
                      />
                    </FormControl>
                  </FormItem>
                ) }
              />
            </div>

            <Button
              type='submit'
              className='w-full font-semibold text-white'
              disabled={ isLoading }
            >
              { isLoading ? "Loading..." : `${ serviceId ? "Save Changes" : "Add Service" }` }
            </Button>

          </div>
        </form>
      </Form>

    </>
  )
}