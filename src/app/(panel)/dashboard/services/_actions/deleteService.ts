"use server"

import z from 'zod'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

const formSchema = z.object({
  serviceId: z.string().min(1, 'ServiceId is required'),
})

type FormSchema = z.infer< typeof formSchema >

export async function deleteService( formData: FormSchema ) {
  const session = await auth()

  if ( !session?.user?.id ) return { error: "Failed to create new service" }

  const schema = formSchema.safeParse( formData )

  if ( !schema.success ) return { error: schema.error.issues[0].message }

  try {
    await prisma.service.update({
      where: {
        id: formData.serviceId,
        userId: session.user.id,
      },
      data: {
        status: false,
      }
    })

    revalidatePath('/dashboard/services')

    return {
      data: "Service deleted with success!"
    }

  } catch (err) {
    console.log( err )
    return { error: "Failed in delete this service" } 
  }
}