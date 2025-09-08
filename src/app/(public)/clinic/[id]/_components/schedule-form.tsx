"use client"

import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const appointmentSchema = z.object({
  name: z.string().min(1, 'Name is required' ),
  email: z.string().min(1, 'Email is required' ),
  phone: z.string().min(1, 'Phone is required' ),
  date: z.date(),
  serviceId: z.string().min(1, 'Service is required' ),
})

export type AppointmentFormData = z.infer< typeof appointmentSchema >

export function useAppointmentForm() {
  return useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      date: new Date(),
      serviceId: "",
    }
  })
}