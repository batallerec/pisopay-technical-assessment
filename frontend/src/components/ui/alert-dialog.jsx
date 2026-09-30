import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';

const cn = (...classNames) => classNames.filter(Boolean).join(' ');

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogCancel = AlertDialogPrimitive.Cancel;
export const AlertDialogAction = AlertDialogPrimitive.Action;

export const AlertDialogContent = ({ className, children, ...props }) => (
  <AlertDialogPrimitive.Portal>
    <AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#173c2e]/45 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out" />
    <AlertDialogPrimitive.Content
      className={cn(
        'fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#dce4da] bg-white p-6 text-[#173c2e] shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out',
        className,
      )}
      {...props}
    >
      {children}
    </AlertDialogPrimitive.Content>
  </AlertDialogPrimitive.Portal>
);

export const AlertDialogHeader = ({ className, ...props }) => (
  <div className={cn('space-y-2', className)} {...props} />
);

export const AlertDialogFooter = ({ className, ...props }) => (
  <div className={cn('mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)} {...props} />
);

export const AlertDialogTitle = ({ className, ...props }) => (
  <AlertDialogPrimitive.Title className={cn('text-lg font-semibold', className)} {...props} />
);

export const AlertDialogDescription = ({ className, ...props }) => (
  <AlertDialogPrimitive.Description className={cn('text-sm leading-6 text-[#68776d]', className)} {...props} />
);