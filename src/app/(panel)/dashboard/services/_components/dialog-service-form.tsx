"use client"

import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  price: z.string().min(1, { message: 'Price is required' }),
  hours: z.string(),
  minutes: z.string(),
})

export interface UseDialogServiceFormProps {
  initialValues?:{
    name: string
    price: string
    hours: string
    minutes: string
  }
}

export type DialogServiceFormData = z.infer< typeof formSchema >

export function useDialogServiceForm( { initialValues }: UseDialogServiceFormProps ) {
  return useForm<DialogServiceFormData>({
    resolver: zodResolver( formSchema ),
    defaultValues: initialValues || {
      name: "",
      price: "",
      hours: "",
      minutes: "",
    },
  })
}