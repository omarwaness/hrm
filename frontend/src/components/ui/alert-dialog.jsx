import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const AlertDialog = ({ open, onOpenChange, children }) => {
  return open ? children : null
}

const AlertDialogTrigger = ({ children, onClick }) => {
  return React.cloneElement(children, { onClick })
}

const AlertDialogContent = React.forwardRef(({ className, children, ...props }, ref) => {
  React.useEffect(() => {
    // Lock body scroll when dialog is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/80 animate-in fade-in-0"
        onClick={props.onClose}
      />
      <div
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%] sm:rounded-lg",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </>
  )
})
AlertDialogContent.displayName = "AlertDialogContent"

const AlertDialogHeader = ({
  className,
  ...props
}) => (
  <div
    className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  ...props
}) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = "AlertDialogTitle"

const AlertDialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
AlertDialogDescription.displayName = "AlertDialogDescription"

const AlertDialogAction = React.forwardRef(({ className, onClick, ...props }, ref) => (
  <Button
    ref={ref}
    className={className}
    onClick={onClick}
    {...props}
  />
))
AlertDialogAction.displayName = "AlertDialogAction"

const AlertDialogCancel = React.forwardRef(({ className, onClick, ...props }, ref) => (
  <Button
    ref={ref}
    variant="outline"
    onClick={onClick}
    className={cn("mt-2 sm:mt-0", className)}
    {...props}
  />
))
AlertDialogCancel.displayName = "AlertDialogCancel"

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} 