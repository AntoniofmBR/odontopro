'use client'

import { toast } from 'sonner'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { subscriptionPlans } from '@/utils/plans'

import { Subscription } from '@/generated/prisma'
import { createPortalCustomer } from '../_actions/create-portal-customer'

interface SubscriptionDetailsProps {
  subscription: Subscription
}

export function SubscriptionDetails( { subscription } : SubscriptionDetailsProps ) {
  const subscriptionInfo = subscriptionPlans.find( plan => plan.id === subscription.plan )

  async function handleManageSubscription() {
    const portal = await createPortalCustomer()

    if ( portal.error ) {
      toast.error('Failed in create the sign portal')
      return
    }

    window.location.href = portal.sessionId

  }

  return (
    <Card className='w-full mx-auto' >
      <CardHeader>
        <CardTitle className='text-2xl' >
          Current plan
        </CardTitle>
        <CardDescription>
          Your active plan!
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className='flex items-center justify-between' >
          <h3 className='font-semibold text-lg md:text-xl' >
            { subscription.plan === 'BASIC' ? 'Basic' : 'Professional' }
          </h3>

          <div className='bg-green-500 text-white e-fit px-4 py-1 rounded-md' >
            { subscription.status === 'active' ? 'Active' : 'Inactive' }
          </div>
        </div>

        <ul className='list-disc list-inside space-y-2' >
          { subscriptionInfo && subscriptionInfo.features.map( feature => (
            <li key={ feature } >
              { feature }
            </li>
          ) ) }
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          onClick={ handleManageSubscription }
        >
          Manage Plan
        </Button>
      </CardFooter>
    </Card>
  )
}