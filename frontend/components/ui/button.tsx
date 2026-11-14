import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-full border-2 font-sans font-bold whitespace-nowrap transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-55 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default:
          "stamp-shadow border-ink bg-cocoa text-cream hover:bg-cocoa-dark",
        outline:
          "stamp-shadow border-ink bg-linen text-ink hover:bg-paper-deep",
        cream:
          "border-cream bg-cream text-wood hover:bg-honey hover:border-honey",
        "outline-cream":
          "border-cream/80 bg-transparent text-cream hover:bg-cream/10",
        secondary: "border-transparent bg-paper-deep text-ink hover:bg-paper-deep/70",
        ghost: "border-transparent bg-transparent text-ink hover:bg-paper-deep",
        destructive:
          "border-tomato bg-transparent text-tomato hover:bg-tomato/10",
        link: "border-transparent px-0 text-cocoa underline underline-offset-4 decoration-2 hover:text-cocoa-dark",
      },
      size: {
        default: "min-h-12 px-6 text-base",
        sm: "min-h-10 px-4 text-sm",
        lg: "min-h-14 px-8 text-lg",
        icon: "size-12",
        "icon-sm": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
