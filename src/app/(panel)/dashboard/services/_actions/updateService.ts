"use server"

import z from 'zod'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

const formSchema = z.object({
  serviceId: z.string().min(1, 'ServiceId is required'),
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(1, 'Price is required'),
  duration: z.number(),
})

type FormSchema = z.infer< typeof formSchema >

export async function updateService( formData: FormSchema ) {
  const session = await auth()

  if ( !session?.user?.id ) return { error: "Failed to update service" }

  const schema = formSchema.safeParse( formData )

  if ( !schema.success ) return { error: schema.error.issues[0].message }

  try {
    await prisma.service.update({
      where: {
        id: formData.serviceId,
        userId: session.user.id,
      },
      data: {
        name: formData.name,
        price: formData.price,
        duration: formData.duration,
      },
    })

    revalidatePath('/dashboard/services')

    return {
      message: "Service updated successfully!"
    }

  } catch (err) {
    console.log( err )
    return { error: "Failed in create a new service" }
  }

}