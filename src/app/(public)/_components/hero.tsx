import Image from 'next/image';
import { Button } from '@/components/ui/button';

import illustration from '../../../../public/doctor-hero.png'

export function Hero() {
  return (
    <section className='bg-white' >
      <div className='container mx-auto px-4 pt-20 pb-4 sm:pb-0 sm:px-6 lg:px-8' >
        <main className='flex items-center justify-center' >
          <article className='flex-[2] max-w-3xl space-y-8 flex flex-col justify-center' >
            <h1 className='text-4xl lg:text-5xl font-bold max-w-2xl tracking-tight' >
              Find the best professionals in one place!
            </h1>
            <p className='text-base md:text-lg text-gray-600' >
              We are a platform for healthcare professionals focused on streamlining their care in a simplified and organized way.
            </p>

            <Button className='bg-emerald-500 hover:bg-emerald-400 w-fit px-6 font-semibold' >
              Find a clinic
            </Button>
          </article>

          <div className='hidden lg:block' >
            <Image
              src={ illustration }
              alt='Doctor Image'
              height={ 400 }
              width={ 340 }
              className='object-contain'
              quality={ 100 }
            />
          </div>
        </main>
      </div>
    </section>
  )
}