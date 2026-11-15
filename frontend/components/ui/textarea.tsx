import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-28 w-full py-3 rounded-xl border-2 border-ink/70 bg-linen px-4 font-sans text-base text-ink transition-colors outline-none placeholder:text-ink-soft/70 focus-visible:border-cocoa focus-visible:ring-4 focus-visible:ring-cocoa/20 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-tomato aria-invalid:ring-4 aria-invalid:ring-tomato/15",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
