import { redirect } from 'next/navigation'

import getSession from '@/lib/getSession'
import { GridPlans } from './_components/grid-plans'
import { getSubscriptions } from '@/utils/get-subscriptions'
import { SubscriptionDetails } from './_components/subscription-details'

export default async function PlansPage() {
  const session = await getSession()

  if ( !session ) redirect("/")

  const subscription = await getSubscriptions( { userId: session.user.id } )

  return (
    <div>
      { subscription?.status !== 'active' ? (
        <GridPlans />
      ) : (
        <SubscriptionDetails subscription={ subscription } />
      ) }
    </div>
  )
}