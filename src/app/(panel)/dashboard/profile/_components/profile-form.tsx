"use client"

import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

interface UserProfileFormProps {
  name: string | null
  address: string | null
  phone: string | null
  status: boolean
  timeZone: string | null
}

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required' ),
  address: z.string().optional(),
  phone: z.string().optional(),
  status: z.string(),
  timeZone: z.string().min(1, 'TimeZone is required'),
})

export type ProfileFormData = z.infer< typeof profileSchema >

export function useProfileForm( { name, address, phone, status, timeZone }: UserProfileFormProps ) {
  return useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: name || "",
      address: address || "",
      phone: phone || "",
      status: status ? "Active" : "Inactive",
      timeZone: timeZone || "",
    }
  })
}