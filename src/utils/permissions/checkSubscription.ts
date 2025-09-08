'use server'

import prisma from '@/lib/prisma'
import { addDays, differenceInDays, isAfter } from 'date-fns'
import { TRIAL_DAYS } from './trialLimits'

export async function checkSubscription( userId: string ) {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      subscription: true,
    },
  })

  if ( !user ) throw new Error( 'User not found' )

  if ( user.subscription && user.subscription.status === 'active' ) {
    return {
      subscriptionStatus: 'active',
      message: 'Assign active',
      planId: user.subscription.plan,
    }
  }

  const trialEndDate = addDays( user.createdAt, TRIAL_DAYS )

  if ( isAfter( new Date(), trialEndDate ) ) {
    return {
      subscriptionStatus: 'EXPIRED',
      message: 'Your trial period expired',
      planId: 'TRIAL',
    }
  }

  const daysRemaining = differenceInDays(trialEndDate, new Date())

  return {
    subscriptionStatus: 'TRIAL',
    message: `Your are in free trial period! You have ${ daysRemaining } days remaining.`,
    planId: 'TRIAL',
  }
}