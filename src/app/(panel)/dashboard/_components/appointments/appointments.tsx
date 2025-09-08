import { getTimesClinic } from '../../_data-access/get-times-clinic'
import { AppointmentsList } from './appointments-list'

interface AppointmentsProps {
  userId: string
}

export async function Appointments( { userId }: AppointmentsProps ) {
  const user = await getTimesClinic( { userId } )

  return (
    <AppointmentsList times={ user.times } />
  )
}