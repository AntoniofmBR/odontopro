export function Footer() {
  return (
    <footer className='py-6 text-center text-gray-500 text-sm md:text-base' >
      <p>
        All Rights Reserved © { new Date().getFullYear() }
      </p>
    </footer>
  )
}