"use server"

import { revalidatePath } from 'next/cache'
import z from 'zod'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required' ),
  address: z.string().optional(),
  phone: z.string().optional(),
  status: z.boolean(),
  timeZone: z.string(),
  times: z.array( z.string() )
})

type FormSchema = z.infer< typeof formSchema >

export async function updateProfile( formData: FormSchema ) {
  const session = await auth()

  if ( !session?.user?.id ) return { error: "User not found" }


  const schema = formSchema.safeParse( formData )

  if ( !schema.success ) {
    return {
      error: "Please fill in all fields"
    }
  }

  try {
    
    await prisma.user.update({
      where: {
        id: session?.user?.id
      },
      data: {
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        status: formData.status,
        timeZone: formData.timeZone,
        times: formData.times || [],
      },
    })

    revalidatePath('/dashboard/profile')

    return {
      data: "Clinic updated with success!"
    }

  } catch(err) {
    return {
      error: 'Failed on update clinic'
    }
  }

}