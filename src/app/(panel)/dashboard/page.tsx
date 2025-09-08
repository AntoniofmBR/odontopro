import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Calendar } from 'lucide-react'

import { Button } from '@/components/ui/button'

import getSession from '@/lib/getSession'
import { ButtonCopyLink } from './_components/button-copy-link'
import { Reminders } from './_components/reminder/reminders'
import { Appointments } from './_components/appointments/appointments'
import { checkSubscription } from '@/utils/permissions/checkSubscription'
import { LabelSubscription } from '@/components/label-subscription'

export default async function DashboardPage() {
  const session = await getSession()

  if ( !session ) redirect("/")

  const subscription = await checkSubscription( session.user.id )

  return (
    <main>
      <div className='space-x-2 flex items-center justify-end' >
        <Link
          href={ `/clinic/${ session.user.id }` }
          target='_blank'
        >
          <Button className='bg-emerald-500 hover:bg-emerald-400 flex-1 md:flex-0' >
            <Calendar className='w-5 h-5' />
            <span> New Appointment </span>

          </Button>
        </Link>
        <ButtonCopyLink userId={ session.user.id } />
      </div>

      { subscription.subscriptionStatus === 'TRIAL' && (
        <div className='bg-green-400 text-white text-sm md:text-base px-3 py-1 rounded-md my-2' >
          <p className='font-semibold' >
            { subscription.message }
          </p>
        </div>
      ) }
      { subscription.subscriptionStatus !== 'EXPIRED' && (
        <section className='grid grid-cols-1 gap-4 lg:grid-cols-2 mt-4' >
          <Appointments userId={ session.user.id } />
          <Reminders userId={ session.user.id } />
        </section>
      ) }

      { subscription.subscriptionStatus === 'EXPIRED' && <LabelSubscription expired /> }
    </main>
  )
}