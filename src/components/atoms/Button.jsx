import { forwardRef } from "react"
import { cn } from "@/utils/cn"
import { motion } from "framer-motion"

const Button = forwardRef(({ 
  className, 
  variant = "default", 
  size = "md", 
  disabled = false,
  children, 
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
  
  const variants = {
    default: "bg-primary text-white hover:bg-blue-700 focus:ring-primary shadow-sm hover:shadow-md",
    outline: "border-2 border-gray-300 text-gray-700 hover:border-primary hover:text-primary focus:ring-primary",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
    accent: "bg-accent text-white hover:bg-amber-600 focus:ring-accent shadow-sm hover:shadow-md",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm hover:shadow-md",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow-md"
  }
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  }

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  )
})

Button.displayName = "Button"

export default Button