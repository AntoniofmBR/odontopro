import { Footer } from './_components/footer';
import { Header } from './_components/header';
import { Hero } from './_components/hero';
import { Professionals } from './_components/professionals';

export const revalidate = 120 // 2 minutes

import { getProfessionals } from './_data-access/get-professionals';

export default async function Home() {
  const professionals = await getProfessionals()

  return (
    <main className='flex flex-col min-h-screen' >
      <Header />
      <div>
        <Hero />
        <Professionals clinics={ professionals || [] } />
        <Footer />
      </div>
    </main>
  );
}