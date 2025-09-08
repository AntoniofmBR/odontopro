import { canPermission } from '@/utils/permissions/canPermission'
import { getAllServices } from '../_data-access/get-all-services'
import { ServicesList } from './services-list'
import { LabelSubscription } from '@/components/label-subscription'

interface ServiceContentProps {
  userId: string
}

export async function ServiceContent( { userId }: ServiceContentProps ) {
  const services = await getAllServices({ userId })
  const permissions = await canPermission({ type: 'service' })

  return (
    <>
      { permissions.planId === 'TRIAL' && (
        <div className='bg-green-400 text-white text-sm md:text-base px-3 py-1 rounded-md my-2' >
          <p className='font-semibold' >
            Your are in test period
          </p>
        </div>
      ) }
      { !permissions.hasPermission && (
         <LabelSubscription expired={ permissions.expired } />
      ) }
      <ServicesList
        services={ services.data || [] }
        permissions={ permissions }
      />
    </>
  )
}