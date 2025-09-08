"use client"

import { useState } from 'react'
import { Pencil, Plus, X } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import { Service } from '@/generated/prisma'

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { formatCentsToReal } from '@/utils/formatCurrency'
import { DialogService } from './dialog-service'
import { deleteService } from '../_actions/deleteService'
import { ResultPermissionProps } from '@/utils/permissions/canPermission'

interface ServicesListProps {
  services: Service[]
  permissions: ResultPermissionProps
}

export function ServicesList( { services, permissions }: ServicesListProps ) {
  const [ isDialogOpen, setIsDialogOpen ] = useState(false)
  const [ isConfirmDialogOpen, setIsConfirmDialogOpen ] = useState<boolean>(false)

  const [ editingService, setEditingService ] = useState< null | Service >(null)
  const [ serviceToDelete, setServiceToDelete ] = useState< null | string >(null)

  const servicesList = permissions.hasPermission ? services : services.slice( 0, 3 )

  async function handleDeleteService( serviceId: string ) {
    const res = await deleteService( { serviceId } )

    if ( res.error ) {
      toast.error( res.error )
    }

    setIsConfirmDialogOpen(false)
    toast.success( res.data )
  }

  async function handleUpdateService( service: Service ) {
    setEditingService(service)
    setIsDialogOpen(true)
  }

  return (
    <Dialog
      open={ isDialogOpen }
      onOpenChange={ ( open ) => {
        setIsDialogOpen( open )
        if ( !open ) setEditingService( null )

      } }
    >
      <section className='mx-auto' >
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2' >
            <CardTitle className='text-xl md:text-2xl font-bold' > Services </CardTitle>
            { permissions.hasPermission ? (
              <DialogTrigger asChild >
                <Button>
                  <Plus className='w-4 h-4' />
                </Button>
              </DialogTrigger>
            ) : (
              <Link href='/dashboard/plans' className='text-red-500' >
                Services limits expired
              </Link>
            ) }

            <DialogContent
              onInteractOutside={ e => {
                e.preventDefault()
                setIsDialogOpen( false )
                setEditingService( null )
              } }
            >
              <DialogService
                handleCloseModal={ () => {
                  setIsDialogOpen( false )
                  setEditingService( null )
                  setIsConfirmDialogOpen( false )
                } }
                serviceId={ editingService ? editingService.id : undefined }
                initialValues={ editingService ? {
                  name: editingService.name,
                  price: ( editingService.price / 100 ).toFixed(2),
                  hours: Math.floor( editingService.duration / 60 ).toString(),
                  minutes: ( editingService.duration % 60 ).toString(),
                } : undefined }
              />
            </DialogContent>

          </CardHeader>

          <CardContent>
            <section className='space-y-4 mt-5' >
              { servicesList.map( service => (
                <article
                  key={ service.id }
                  className='flex items-center justify-between'
                >
                  <div className='flex items-center space-x-2' >
                    <span className='font-medium' >{ service.name }</span>
                    <span className='text-gray-500' >-</span>
                    <span className='text-gray-400' >
                      { formatCentsToReal( ( service.price / 100 )) }
                    </span>
                  </div>

                  <div>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={ () => handleUpdateService( service ) }
                    >
                      <Pencil className='w-4 h-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={ () => {
                        setServiceToDelete( service.id )
                        setIsConfirmDialogOpen( true )
                      } }
                    >
                      <X className='w-4 h-4' />
                    </Button>
                  </div>
                </article>
              )) }
            </section>
          </CardContent>
        </Card>

        { serviceToDelete && (
          <ConfirmDialog
          open={ isConfirmDialogOpen }
          onOpenChange={ setIsConfirmDialogOpen }
          action={ () => handleDeleteService( serviceToDelete ) }
          title={
            `Are you sure you want delete the service?`
          }
        />
        ) }

      </section>
    </Dialog>
  )
}