import { redirect } from 'next/navigation'

import { ServiceContent } from './_components/service-content'

import getSession from '@/lib/getSession'
import { Suspense } from 'react'

export default async function ServicesPage() {
  const session = await getSession()

  if ( !session ) redirect('/')

  return (
    <Suspense fallback={ <div> Loading... </div> } >
      <ServiceContent userId={ session.user?.id! } />
    </Suspense>
  )
}