import { motion } from "framer-motion"
import { format } from "date-fns"
import ApperIcon from "@/components/ApperIcon"
import Badge from "@/components/atoms/Badge"
import Card from "@/components/atoms/Card"

const ContactCard = ({ 
  contact, 
  onClick,
  onEdit, 
  onDelete, 
  className = "" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card 
        className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 group"
        onClick={() => onClick?.(contact)}
        hover
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
              {contact.name}
            </h4>
            <p className="text-sm text-gray-600">{contact.company}</p>
            <p className="text-xs text-gray-500">{contact.email}</p>
          </div>
          
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit?.(contact)
              }}
              className="p-1 text-gray-400 hover:text-primary rounded"
            >
              <ApperIcon name="Edit2" className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.(contact.Id)
              }}
              className="p-1 text-gray-400 hover:text-red-500 rounded"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {contact.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="default" size="sm">
                {tag}
              </Badge>
            ))}
            {contact.tags.length > 2 && (
              <Badge variant="default" size="sm">
                +{contact.tags.length - 2}
              </Badge>
            )}
          </div>
          <div className="text-xs text-gray-500">
            {format(new Date(contact.lastActivity), "MMM d")}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default ContactCard