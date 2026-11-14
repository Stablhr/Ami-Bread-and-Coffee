import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "min-h-12 w-full min-w-0 rounded-xl border-2 border-ink/70 bg-linen px-4 py-2 font-sans text-base text-ink transition-colors outline-none placeholder:text-ink-soft/70 focus-visible:border-cocoa focus-visible:ring-4 focus-visible:ring-cocoa/20 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-tomato aria-invalid:ring-4 aria-invalid:ring-tomato/15",
        className
      )}
      {...props}
    />
  )
}

export { Input }
