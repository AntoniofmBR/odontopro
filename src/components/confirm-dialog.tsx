import { Dispatch, SetStateAction } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
  action: () => void
  title?: string
  description?: string
}

export function ConfirmDialog({
  open,
  action,
  onOpenChange,
  title,
  description,
}: ConfirmDialogProps ) {
  return (
    <Dialog open={ open } onOpenChange={ onOpenChange } >
      <DialogContent className='w-full max-w-md' >
        <DialogHeader className='flex items-center justify-between pb-2' >
          <DialogTitle className='w-full text-xl text-center font-bold' >
           { title || "Are you sure you want to do this?" }
          </DialogTitle>
          <DialogDescription>
           { description || "This action is irreversible" }
          </DialogDescription>
        </DialogHeader>

        <div className='mt-4 flex justify-center gap-4' >
            <Button
              onClick={ () => onOpenChange(false) }
              className='w-1/3'
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={ action }
              className='w-1/3'
            >
              Delete
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

