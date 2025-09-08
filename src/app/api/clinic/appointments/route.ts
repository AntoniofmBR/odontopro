import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export const GET = auth( async function ( req ) {
  if ( !req.auth ) return NextResponse.json({ error: 'Not allowed!' },{ status: 401 } )

  const searchParams = req.nextUrl.searchParams
  const dateString = searchParams.get('date') as string
  const clinicId = req.auth.user.id

  if ( !clinicId ) return NextResponse.json({ error: 'User not found!' },{ status: 400 } )

  if ( !dateString ) return NextResponse.json({ error: 'Date not informed!' },{ status: 400 } )

  try {
    const [ year, month, day ] = dateString.split('-').map( Number )

    const startDate = new Date( Date.UTC( year, month - 1, day, 0, 0, 0, 0 ) )
    const endDate = new Date( Date.UTC( year, month - 1, day, 23, 59, 59, 999 ) )

    const appointments = await prisma.appointment.findMany({
      where: {
        userId: clinicId,
        appointmentDate: {
          gte: startDate,
          lte: endDate,
        }
      },
      include: {
        service: true,
      }
    })

    return NextResponse.json(appointments )

  } catch ( err ) {
    console.log( err )
    return NextResponse.json({ error: 'Failed in search appointments!' },{ status: 400 } )
  }
} )
