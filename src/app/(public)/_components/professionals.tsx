import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Card, CardContent } from '@/components/ui/card'

import illustration from '../../../../public/foto1.png'
import { Prisma } from '@/generated/prisma/client'
import { PremiumBadge } from './premium-badge'

type UserWithSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true,
  }
}>

interface ProfessionalsProps {
  clinics: UserWithSubscription[]
}

export function Professionals( { clinics }: ProfessionalsProps ) {
  return (
    <section className='bg-gray-50 py-16' >
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <h2 className='text-3xl text-center mb-12 font-bold' >
          Available Clinics
        </h2>

        <section className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4' >

          { clinics.map( clinic => (
            <Card className='overflow-hidden p-0 hover:shadow-lg duration-300' key={ clinic.id } >
              <CardContent className='p-0' >
                <div>
                  <div className='relative h-48' >
                    <Image
                      src={ clinic.image || illustration }
                      alt={ `${ clinic.name } Image` }
                      fill
                      className='object-cover'
                    />
                    { clinic.subscription?.status === 'active' && clinic.subscription.plan === 'PROFESSIONAL' && (
                      <PremiumBadge />
                    ) }
                  </div>
                </div>

                <div className='p-4 space-y-4 min-h-40 flex flex-col justify-between' >
                  <div className='flex items-center justify-between' >
                    <div>
                      <h3 className='font-semibold' >
                        { clinic.name }
                      </h3>
                      <p className='text-sm text-gray-500 line-clamp-2' >
                        { clinic.address ?? 'Address not informed' }
                      </p>
                    </div>
                  </div>

                  <Link
                    href={ `/clinic/${ clinic.id }` }
                    target='_blank'
                    className='w-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center py-2 rounded-md text-sm md:text-base font-medium '
                  >
                    Schedule Time
                    <ArrowRight className='ml-2' />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) ) }
        </section>

      </div>
    </section>
  )
}