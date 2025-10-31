import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Input = forwardRef(({ 
  className, 
  type = "text",
  label,
  error,
  disabled = false,
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          "w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
          "disabled:bg-gray-100 disabled:cursor-not-allowed",
          "transition-all duration-200",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        ref={ref}
        disabled={disabled}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
})

Input.displayName = "Input"

export default Input