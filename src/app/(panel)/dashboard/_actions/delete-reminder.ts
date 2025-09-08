'use server'

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import prisma from '@/lib/prisma';

const formSchema = z.object({
  reminderId: z.string().min( 1,'Reminder Id is required'),
})

type FormSchema = z.infer< typeof formSchema >

export async function deleteReminder( formData: FormSchema ) {
  const schema = formSchema.safeParse( formData )
  
  if ( !schema.success ) {
    return {
      error: schema.error.issues[0].message,
    }
  }
  
  try {
    await prisma.reminder.delete({
      where: {
        id: formData.reminderId,
      }
    })

    revalidatePath('/dashboard')

    return {
      data: 'Reminder delete successfully!'
    }

  } catch ( err ) {
    console.log( err )
    return {
      error: 'Cannot delete reminder, please try again later.'
    }
  }

}
