import { redirect } from 'next/navigation'

import { getInfoSchedule } from './_data-access/get-info-schedule'
import { ScheduleContent } from './_components/schedule-content'

export default async function SchedulePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {

  const userId = ( await params ).id
  const user = await getInfoSchedule( { userId } )

  //TODO: return something to the user instead just redirect him
  if ( !user ) {
    redirect('/')
  }

  return (
    <ScheduleContent clinic={ user } />
  )
}