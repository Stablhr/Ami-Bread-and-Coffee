'use client';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {Button} from '@/components/ui/button';

/** "Are you sure?" before a product is permanently removed. */
export function DeleteProductDialog({
  open,
  onOpenChange,
  productName,
  onConfirm,
  isDeleting,
  error
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  onConfirm: () => void;
  isDeleting: boolean;
  error: string | null;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete “{productName}”?</AlertDialogTitle>
          <AlertDialogDescription>
            It will disappear from the menu right away and its photo will be removed. This can&apos;t be
            undone. If it&apos;s only out of stock, turn off “Available” instead.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && (
          <p role="alert" className="font-bold text-tomato">
            {error}
          </p>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Keep it</AlertDialogCancel>
          <Button
            type="button"
            className="border-tomato bg-tomato hover:bg-tomato/90"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting…' : 'Delete product'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
