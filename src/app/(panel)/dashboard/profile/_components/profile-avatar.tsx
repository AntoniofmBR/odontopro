'use client'

import { ChangeEvent, useState } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { Loader, Upload } from 'lucide-react'
import { toast } from 'sonner'

import genericImg from '../../../../../../public/foto1.png'
import { updateAvatar } from '../_actions/update-avatar'

interface AvatarProfileProps {
  avatarUrl: string | null
  userId: string
}

export function AvatarProfile( { avatarUrl, userId }: AvatarProfileProps ) {
  const [ previewImage, setPreviewImage ] = useState( avatarUrl )
  const [ loading, setLoading ] = useState( false )

  const { update } = useSession()

  async function uploadImage( img: File ): Promise< string | null > {
    try {
      toast('Sending new image...')

      const formData = new FormData()

      formData.append( 'file', img )
      formData.append( 'userId', userId )

      const res = await fetch( `${ process.env.NEXT_PUBLIC_URL }/api/image/upload`, {
        method: 'POST',
        body: formData,
      } )

      if ( !res.ok ) {
        toast.error( 'Failed in upload a new avatar, please try again later.' )
        return null
      }

      const data = await res.json()

      toast.success( 'Image uploaded successfully!' )
      return data.secure_url as string

    } catch ( err ) {
      console.log( err )
      return null
    }
  }

  async function handleChange( e: ChangeEvent<HTMLInputElement> ) {
    if ( e.target.files && e.target.files[0] ) {
      setLoading( true )
      const image = e.target.files[0]

      if ( image.type !== 'image/jpeg' && image.type !== 'image/png' ) {
        setLoading( false )
        toast.error('Image format invalid!')
        return
      }

      const newFileName = `${ userId }`
      const newFile = new File( [image], newFileName, { type: image.type } )

      const urlImage = await uploadImage( newFile )

      if ( !urlImage ) {
        toast.error('Failed in change image')
        return
      }

      setPreviewImage( urlImage )

      await updateAvatar( { avatarUrl: urlImage } )
      await update({
        image: urlImage,
      })

      setLoading( false )

    }
  }

  return (
    <div className='relative w-40 h-40 md:w-48 md:h-48' >

      <div className='relative flex items-center justify-center w-full h-full' >
        <span className='absolute cursor-pointer z-[2] bg-slate-50/80 p-2 rounded-full shadow-xl' >
          { loading
            ? <Loader size={ 16 } color='#131313' className='animate-spin' />
            : <Upload size={ 16 } color='#131313' />
          }
        </span>

        <input
          type="file"
          className='opacity-0 cursor-pointer relative z-50 w-48 h-48'
          onChange={ handleChange }
        />

      </div>

      { previewImage ? (
        <Image
          src={ previewImage }
          alt='Profile Image'
          className='w-full h-48 object-cover rounded-full bg-slate-200'
          quality={ 100 }
          priority
          fill
          sizes='( max-width: 480px ) 100vw, ( max-width: 1024px ) 75vw, 60vw'
        />
      ) : (
        <Image
          src={ genericImg }
          alt='Generic Profile Image'
          className='w-full h-48 object-cover rounded-full bg-slate-200'
          quality={ 100 }
          priority
          fill
          sizes='( max-width: 480px ) 100vw, ( max-width: 1024px ) 75vw, 60vw'
        />
      ) }
    </div>
  )
}