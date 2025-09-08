"use server"

import prisma from '@/lib/prisma'

export async function getAllServices({ userId }: { userId: string }) {
  if ( !userId ) return { error: "Failed to search services" }

  try {
    const services = await prisma.service.findMany({
      where: {
        userId,
        status: true,
      }
    })

    return {
      data: services,
    }

  } catch (err) {
    console.log( err )
    return {
      error: "Failed to search services"
    }
  }

}