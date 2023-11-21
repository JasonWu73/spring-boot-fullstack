import { AlertOctagon } from 'lucide-react'
import React from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/shared/components/ui/AlertDialog'
import { buttonVariants } from '@/shared/components/ui/Button'

type DeleteUserProps = {
  action: React.ReactNode | string
  title: React.ReactNode | string
  onConfirm: () => void
}

function ConfirmDialog({ action, title, onConfirm }: DeleteUserProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{action}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className="flex items-center">
            <AlertOctagon className="mr-1 h-4 w-4 text-amber-500 dark:text-amber-600" />
            此操作无法撤消，这将永久删除数据。
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={buttonVariants({ variant: 'destructive' })}
          >
            确认
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { ConfirmDialog }
