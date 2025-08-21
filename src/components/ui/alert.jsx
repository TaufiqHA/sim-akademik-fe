import * as React from "react"
import { cn } from "@/lib/utils"

function Alert({
  className,
  variant = "default",
  ...props
}) {
  const baseClasses = "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground"

  const variantClasses = {
    default: "bg-background text-foreground border-border",
    destructive: "border-red-200 bg-red-50 text-red-900 [&>svg]:text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-50 dark:[&>svg]:text-red-400",
    warning: "border-yellow-200 bg-yellow-50 text-yellow-900 [&>svg]:text-yellow-600 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-50 dark:[&>svg]:text-yellow-400",
    info: "border-blue-200 bg-blue-50 text-blue-900 [&>svg]:text-blue-600 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-50 dark:[&>svg]:text-blue-400"
  }

  return (
    <div
      role="alert"
      className={cn(
        baseClasses,
        variantClasses[variant] || variantClasses.default,
        className
      )}
      {...props}
    />
  );
}

function AlertTitle({
  className,
  ...props
}) {
  return (
    <h5
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}) {
  return (
    <div
      className={cn("text-sm [&_p]:leading-relaxed", className)}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription }
