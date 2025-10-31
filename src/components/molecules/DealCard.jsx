import { motion } from "framer-motion"
import { format } from "date-fns"
import ApperIcon from "@/components/ApperIcon"
import Badge from "@/components/atoms/Badge"
import Card from "@/components/atoms/Card"
import { cn } from "@/utils/cn"

const DealCard = ({ 
  deal, 
  onEdit, 
  onDelete, 
  isDragging = false,
  className = "",
  ...props 
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getValueColor = (value) => {
    if (value >= 50000) return "text-green-600"
    if (value >= 20000) return "text-accent"
    return "text-gray-600"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "cursor-pointer select-none",
        isDragging && "opacity-50 rotate-3 scale-105 z-50",
        className
      )}
      {...props}
    >
      <Card 
        className="p-4 hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary group"
        hover
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">
              {deal.title}
            </h4>
            <p className="text-sm text-gray-600 truncate">
              {deal.contactName}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {deal.contactCompany}
            </p>
          </div>
          
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit?.(deal)
              }}
              className="p-1 text-gray-400 hover:text-primary rounded"
            >
              <ApperIcon name="Edit2" className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.(deal.Id)
              }}
              className="p-1 text-gray-400 hover:text-red-500 rounded"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className={`text-lg font-bold ${getValueColor(deal.value)}`}>
            {formatCurrency(deal.value)}
          </div>
          <div className="text-xs text-gray-500">
            {format(new Date(deal.updatedAt), "MMM d")}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default DealCard