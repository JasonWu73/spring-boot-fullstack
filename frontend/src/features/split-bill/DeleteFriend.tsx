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
} from '@/ui/shadcn-ui/AlertDialog'

type DeleteFriendButtonProps = {
  onDelete: () => void
}

function DeleteFriend({onDelete}: DeleteFriendButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="absolute left-2 top-1 hidden text-xs group-hover:block">
        ❌
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>您确定删除该好友吗？</AlertDialogTitle>
          <AlertDialogDescription>
            此操作无法撤消，这将永久删除您的朋友。
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>确认</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export {DeleteFriend}
