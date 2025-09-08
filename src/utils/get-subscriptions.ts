'use server'

import prisma from '@/lib/prisma'

export async function getSubscriptions( { userId }: { userId: string } ) {
  if ( !userId ) return null

  try {
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
      },
    })

    return subscription

  } catch ( err ) {
    console.log( err )
    return null
  }

}