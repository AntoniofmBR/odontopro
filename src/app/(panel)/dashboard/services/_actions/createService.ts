"use server"

import z from 'zod'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(1, 'Price is required'),
  duration: z.number(),
})

type FormSchema = z.infer< typeof formSchema >

export async function createNewService( formData: FormSchema ) {
  const session = await auth()

  if ( !session?.user?.id ) return { error: "Failed to create new service" }

  const schema = formSchema.safeParse( formData )

  if ( !schema.success ) return { error: schema.error.issues[0].message }

  try {
    const newService = await prisma.service.create({
      data: {
        name: formData.name,
        price: formData.price,
        duration: formData.duration,
        userId: session.user.id,
      },
    })

    revalidatePath('/dashboard/services')

    return {
      data: newService,
      message: 'Service created successfully!',
    }

  } catch (err) {
    console.log( err )
    return { error: "Failed in create a new service" }
  }


}