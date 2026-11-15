"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "@/lib/utils"

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border-2 border-ink/70 transition-all outline-none after:absolute after:-inset-2 focus-visible:ring-4 focus-visible:ring-cocoa/25 data-[size=default]:h-8 data-[size=default]:w-14 data-[size=sm]:h-6 data-[size=sm]:w-10 data-checked:border-leaf data-checked:bg-leaf data-unchecked:bg-paper-deep data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-full bg-linen shadow ring-0 transition-transform group-data-[size=default]/switch:size-6 group-data-[size=sm]/switch:size-4 translate-x-0.5 data-checked:translate-x-[1.6rem] group-data-[size=sm]/switch:data-checked:translate-x-[1.1rem]"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
