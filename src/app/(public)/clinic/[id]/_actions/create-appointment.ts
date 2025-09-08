'use server'

import { z } from 'zod'

import prisma from '@/lib/prisma'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Email is required'),
  phone: z.string().min(1, 'Phone is required'),
  date: z.date(),
  serviceId: z.string().min(1, 'ServiceId is required'),
  time: z.string().min(1, 'Time is required'),
  clinicId: z.string().min(1, 'Clinic is required'),
})

type FormSchema = z.infer< typeof formSchema >

export async function createAppointment( formData: FormSchema ) {
  const schema = formSchema.safeParse( formData )

  if ( !schema.success ) {
    return {
      error: schema.error.issues[0].message
    }
  }

  try {
    const selectedDate = new Date( formData.date )

    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth()
    const day = selectedDate.getDate()

    const appointmentDate = new Date( Date.UTC( year, month, day, 0,0,0,0 ) )

    const newAppointment = await prisma.appointment.create({
      data: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        time: formData.time,
        appointmentDate,
        serviceId: formData.serviceId,
        userId: formData.clinicId,
      }
    })

    return {
      data: newAppointment,
    }

  } catch ( err ) {
    console.log( err )
    return {
      error: "Cant create appointment",
    }
  }

}