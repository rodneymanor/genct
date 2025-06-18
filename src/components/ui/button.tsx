import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Supabase Green Brand Button
        brand:
          "border bg-brand-400 dark:bg-brand-500 hover:bg-brand/80 dark:hover:bg-brand/50 text-foreground border-brand-500/75 dark:border-brand/30 hover:border-brand-600 dark:hover:border-brand focus-visible:outline-brand-600 data-[state=open]:bg-brand-400/80 dark:data-[state=open]:bg-brand-500/80 data-[state=open]:outline-brand-600",
        
        // White/Transparent Dashed Border Button
        dashed:
          "text-foreground border border-dashed border-strong hover:border-stronger bg-transparent focus-visible:outline-border-strong data-[state=open]:border-stronger data-[state=open]:outline-border-strong",
        
        // Standard variants (simplified)
        default:
          "bg-primary text-primary-foreground border border-gray-300 hover:bg-primary/90 dark:border-gray-600",
        destructive:
          "bg-destructive text-white border border-gray-300 hover:bg-destructive/90 dark:border-gray-600",
        outline:
          "border bg-background border-gray-300 hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-gray-600",
        secondary:
          "bg-secondary text-secondary-foreground border border-gray-300 hover:bg-secondary/80 dark:border-gray-600",
        ghost:
          "border border-transparent hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline border border-transparent",
      },
      size: {
        // Supabase tiny size
        tiny: "text-xs px-2.5 py-1 h-[26px] [&_svg]:h-[14px] [&_svg]:w-[14px]",
        
        // Standard sizes
        default: "h-9 px-4 py-2 has-[>svg]:px-3 [&_svg:not([class*='size-'])]:size-4",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 [&_svg:not([class*='size-'])]:size-4",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4 [&_svg:not([class*='size-'])]:size-4",
        icon: "size-9 [&_svg:not([class*='size-'])]:size-4",
        "icon-tiny": "w-[26px] h-[26px] [&_svg]:h-[14px] [&_svg]:w-[14px]",
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
