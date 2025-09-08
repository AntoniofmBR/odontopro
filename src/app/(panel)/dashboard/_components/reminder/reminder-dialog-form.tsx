'use client'

import { toast } from 'sonner'

import { ReminderFormdata, useReminderForm } from './reminder-form'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createNewReminder } from '../../_actions/create-reminder'

interface ReminderDialogFormProps {
  closeDialog: () => void
}

export function ReminderDialogForm({ closeDialog }: ReminderDialogFormProps ) {
  const form = useReminderForm()

  async function handleSubmit( formData: ReminderFormdata ) {
    const res = await createNewReminder( { description: formData.description } )

    if ( res.error ) {
      toast.error( res.error )
      return
    }

    closeDialog()
    toast.success( res.data )
  }

  return (
    <div className='grid gap-4 py-4' >
      <Form { ...form } >
        <form
          className='flex flex-col gap-4'
          onSubmit={ form.handleSubmit( handleSubmit ) }
        >
          <FormField
            control={ form.control }
            name='description'
            render={ ({ field }) => (
              <FormItem>
                <FormLabel className='font-semibold' > Describe the reminder: </FormLabel>
                <FormControl>
                  <Textarea
                    { ...field }
                    placeholder='Type the name of reminder'
                    className='max-h-52 resize-none'
                  />
                </FormControl>
              </FormItem>
            ) }
          />

          <Button
            type='submit'
            disabled={ !form.watch('description') }
          >
            Register Reminder
          </Button>
        </form>
      </Form>
    </div>
  )
}