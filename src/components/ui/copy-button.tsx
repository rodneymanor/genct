"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Clipboard, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CopyButtonProps {
  textToCopy: string
  buttonText?: string
  className?: string
  size?: "sm" | "default" | "lg"
  variant?: "default" | "ghost" | "outline"
  showDemo?: boolean // For demo purposes
}

export function CopyButton({ 
  textToCopy, 
  buttonText = "Copy", 
  className,
  size = "sm",
  variant = "outline",
  showDemo = false
}: CopyButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      setIsOpen(true)
      
      // Reset state after a delay
      setTimeout(() => setIsOpen(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const button = (
    <Button
      type="button"
      onClick={handleClick}
      data-state={isOpen ? "open" : "closed"}
      className={cn(
        // Custom Supabase-inspired styles that don't conflict with base button
        "relative transition-all duration-200 font-regular",
        // Custom tiny size (overrides sm when needed)
        size === "sm" && "text-xs px-2.5 py-1 h-[26px]",
        // Enhanced focus styles (works with base focus)
        "focus-visible:ring-offset-1",
        // State-specific border enhancements
        "data-[state=open]:border-border-stronger",
        className
      )}
      variant={variant}
      size={size}
    >
      <div className="[&_svg]:h-[14px] [&_svg]:w-[14px] text-foreground-lighter">
        {isOpen ? <Check className="lucide lucide-check" /> : <Clipboard className="lucide lucide-clipboard" />}
      </div>
      <span className="truncate">{buttonText}</span>
    </Button>
  )

  // If showDemo is true, wrap in demo container
  if (showDemo) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        {button}
      </div>
    )
  }

  return button
}

// Default export for backwards compatibility
export default function Component() {
  return (
    <CopyButton 
      textToCopy="SELECT * FROM users WHERE active = true;" 
      buttonText="Copy as SQL"
      showDemo={true}
    />
  )
}
