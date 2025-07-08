import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive group cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-foreground/20 rounded-full bg-transparent font-montserrat font-medium text-foreground hover:bg-foreground hover:text-background hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out group uppercase tracking-wider",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-[1.02] active:scale-[0.98]",
        ghost:
          "border border-foreground/20 rounded-full font-montserrat font-medium text-foreground bg-transparent hover:bg-foreground/10 hover:border-foreground/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out",
        link: "text-primary underline-offset-4 hover:underline hover:scale-[1.02] active:scale-[0.98]",
        professional: "border border-foreground/20 rounded-full font-montserrat font-medium text-foreground bg-transparent hover:bg-foreground hover:text-background hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out",
        "professional-outline": "border border-background/20 rounded-full font-montserrat font-medium text-background bg-transparent hover:bg-background/10 hover:text-foreground hover:border-background/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out group uppercase tracking-wider",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-full gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-full px-6 has-[>svg]:px-4",
        xl: "h-12 px-8 py-3 text-base rounded-full",
        icon: "size-9 rounded-full",
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
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
