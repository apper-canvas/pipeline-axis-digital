import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { motion } from "framer-motion"
import { cn } from "@/utils/cn"

const Header = ({ onQuickAdd }) => {
  const location = useLocation()
  
  const navigation = [
    { name: "Pipeline", href: "/", icon: "BarChart3" },
    { name: "Contacts", href: "/contacts", icon: "Users" },
    { name: "Activities", href: "/activities", icon: "Activity" }
  ]

  const isActive = (href) => {
    if (href === "/") {
      return location.pathname === "/"
    }
    return location.pathname.startsWith(href)
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-700 rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Pipeline Pro</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  "flex items-center space-x-2",
                  isActive(item.href)
                    ? "text-primary bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <ApperIcon name={item.icon} className="w-4 h-4" />
                <span>{item.name}</span>
                {isActive(item.href) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-blue-50 rounded-lg -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Quick Add Button */}
          <div className="flex items-center space-x-4">
            <Button onClick={onQuickAdd} size="sm">
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              Quick Add
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex-1 flex flex-col items-center px-2 py-3 text-xs font-medium",
                isActive(item.href)
                  ? "text-primary bg-blue-50 border-t-2 border-primary"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <ApperIcon name={item.icon} className="w-5 h-5 mb-1" />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}

export default Header