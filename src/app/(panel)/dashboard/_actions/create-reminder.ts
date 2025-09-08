'use server'

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

const formSchema = z.object({
  description: z.string().min( 1,'Description is required'),
})

type FormSchema = z.infer< typeof formSchema >

export async function createNewReminder( formData: FormSchema ) {
  const schema = formSchema.safeParse( formData )
  const session = await auth()

  if ( !session?.user.id ) return { error: 'Failed in create new reminder' }

  if ( !schema.success ) {
    return {
      error: schema.error.issues[0].message,
    }
  }

  try {
    await prisma.reminder.create({
      data: {
        description: formData.description,
        userId: session.user.id,
      },
    })

    revalidatePath('/dashboard')

    return {
      data: 'Reminder create successfully!'
    }

  } catch ( err ) {
    console.log( err )
    return {
      error: 'Failed in create new reminder',
    }
  }

}