'use server'

import { revalidatePath } from 'next/cache'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function updateAvatar( { avatarUrl }: { avatarUrl: string } ) {
  const session = await auth()

  if ( !avatarUrl ) return { error: 'Failed in change image' }
  if ( !session?.user.id ) return { error: 'User not found' }

  try {
    await prisma.user.update({
      data: {
        image: avatarUrl,
      },
      where: {
        id: session.user.id,
      },
    })

    revalidatePath('/dashboard/profile')

    return {
      data: 'Image updated successfully!'
    }


  } catch ( err ) {
    console.log( err )
  }

}