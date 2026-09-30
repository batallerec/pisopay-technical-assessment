import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

const cn = (...classNames) => classNames.filter(Boolean).join(' ');

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
export const DropdownMenuRadioItem = ({ className, children, ...props }) => (
  <DropdownMenuPrimitive.RadioItem
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm text-[#405148] outline-none transition data-[highlighted]:bg-[#eef3ed] data-[state=checked]:bg-[#eaf4ff] data-[state=checked]:font-semibold data-[state=checked]:text-[#116bb8]',
      className,
    )}
    {...props}
  >
    <DropdownMenuPrimitive.ItemIndicator className="mr-2 text-[#36A8FF]">&#10003;</DropdownMenuPrimitive.ItemIndicator>
    {children}
  </DropdownMenuPrimitive.RadioItem>
);

export const DropdownMenuContent = ({ className, sideOffset = 8, ...props }) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      sideOffset={sideOffset}
      className={cn(
        'z-50 min-w-44 rounded-xl border border-[#dce4da] bg-white p-1.5 text-[#173c2e] shadow-xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out',
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
);