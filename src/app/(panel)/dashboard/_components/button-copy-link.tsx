'use client'

import { LinkIcon } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

export function ButtonCopyLink( { userId }: { userId: string } ) {
  async function handleCopyLink() {
    await navigator.clipboard.writeText(`${ process.env.NEXT_PUBLIC_URL }/clinic/${ userId }`)
    toast.success('Link copied successfully!')
  }

  return (
    <Button onClick={ handleCopyLink } >
      <LinkIcon className='w-5 h-5' />
    </Button>
  )
}