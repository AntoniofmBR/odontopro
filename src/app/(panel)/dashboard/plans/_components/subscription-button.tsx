'use client'

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Plan } from '@/generated/prisma';
import { getStripeJs } from '@/utils/stripe-js';

import { createSubscription } from '../_actions/create-subscription';

interface SubscriptionButton {
  type: Plan
}

export function SubscriptionButton( { type }: SubscriptionButton ) {
  async function handleCreateBilling() {
    const res = await createSubscription( { type: type } )

    if ( res.error ) {
      return toast.error( res.error )
    }

    const stripe = await getStripeJs()

    if ( stripe ) await stripe.redirectToCheckout({ sessionId: res.sessionId })
  }

  return (
    <Button
      className={ `w-full ${ type === 'BASIC' ? 'bg-black' : 'bg-emerald-500' }` }
      onClick={ handleCreateBilling }
    >
      Get Plan
    </Button>
  )
}