import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from './ui/button.tsx'

export default function Question({
  open,
  onOpenChange,
  title,
  question,
  onYes,
}: {
  title?: string
  question: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onYes: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title ?? 'Question'}</DialogTitle>
          <DialogDescription>{question}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:space-x-0">
          <DialogClose asChild>
            <Button variant="outline">no</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" onClick={onYes}>
              Yes
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
