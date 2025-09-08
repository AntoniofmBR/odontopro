import { Star } from 'lucide-react';

export function PremiumBadge() {
  return (
    <div className='absolute top-2 right-2 bg-yellow-500 w-7 h-7 z-[2] rounded-full flex items-center justify-center' >
      <Star size={ 16 } color='#F9F9F9' fill='#F9F9F9' />
    </div>
  )
}