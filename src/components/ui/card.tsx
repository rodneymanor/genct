import * as React from "react"

import { cn } from "@/lib/utils"

/* 🔍 SEARCH: card, panel, gradient, border, supabase */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn(
      "group/panel rounded-lg md:rounded-xl p-px bg-gradient-to-b from-border to-border/50 dark:to-border/30 transition-all hover:shadow-md flex items-center justify-center hover:bg-none hover:!bg-border-stronger relative w-full h-full",
      className
    )}>
      <div
        data-slot="card"
        className="z-10 rounded-[7px] md:rounded-[11px] relative overflow-hidden flex-1 flex flex-col gap-6 bg-surface-75 w-full h-full text-card-foreground py-6 shadow-sm"
        {...props}
      />
    </div>
  )
}

/* 🔍 SEARCH: card-header, container-query, grid */
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

/* 🔍 SEARCH: card-title, typography, heading */
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

/* 🔍 SEARCH: card-description, muted-text, subtitle */
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

/* 🔍 SEARCH: card-action, grid-positioning, buttons */
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

/* 🔍 SEARCH: card-content, padding, main-content */
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

/* 🔍 SEARCH: card-footer, actions, bottom-content */
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
