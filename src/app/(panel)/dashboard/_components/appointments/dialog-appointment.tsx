import { format } from 'date-fns';

import {
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';

import { formatCentsToReal } from '@/utils/formatCurrency';

import { AppointmentWithService } from './appointments-list';


interface DialogAppointmentProps {
  appointment: AppointmentWithService | null
}

export function DialogAppointment( { appointment }: DialogAppointmentProps ) {


  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          Appointment Details
        </DialogTitle>
        <DialogDescription>
          Check all details of appointment:
        </DialogDescription>
      </DialogHeader>

      <div className='py-4' >
        { appointment && (
          <article>
            <p>
              <span className='font-semibold' > Date: </span>
              { new Intl.DateTimeFormat( 'pt-BR', {
                timeZone: 'UTC',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              } ).format( new Date( appointment.appointmentDate ) ) }
            </p>
            <p className='mb-2' >
              <span className='font-semibold' > Time: </span>
              { appointment.time }
            </p>
            <p>
              <span className='font-semibold' > Name: </span>
              { appointment.name }
            </p>
            <p>
              <span className='font-semibold' > Phone: </span>
              { appointment.phone }
            </p>
            <p>
              <span className='font-semibold' > Email: </span>
              { appointment.email }
            </p>

            <section className='bg-gray-200 mt-4 p-2 rounded-md' >
              <p>
                <span className='font-semibold' > Service: </span>
                { appointment.service.name }
              </p>
              <p>
                <span className='font-semibold' > Price: </span>
                { formatCentsToReal( ( appointment.service.price ) / 100 ) }
              </p>
            </section>
          </article>
        ) }
      </div>

    </DialogContent>
  )
}