'use server'

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

const formSchema = z.object({
  appointmentId: z.string().min(1, 'You need pass a appointment'),
})

type FormSchema = z.infer< typeof formSchema >

export async function cancelAppointments( formData: FormSchema ) {
  const schema = formSchema.safeParse( formData )

  if ( !schema.success ) return { error: schema.error.issues[0].message }

  const session = await auth()

  if ( !session?.user.id ) return { error: 'User not found' }

  try {
    await prisma.appointment.delete({
      where: {
        id: formData.appointmentId,
        userId: session.user.id,
      },
    })

    revalidatePath('/dashboard')

    return {
      data: 'Appointment canceled successfully!'
    }

  } catch ( err ) {
    console.log( err )
    return {
      error: 'Failed in cancel appointment'
    }
  }

}

