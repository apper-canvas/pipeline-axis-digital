import { motion } from "framer-motion"
import { format } from "date-fns"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"

const ActivityCard = ({ 
  activity, 
  showContact = true,
  className = "" 
}) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case "call": return "Phone"
      case "email": return "Mail"
      case "meeting": return "Calendar"
      case "note": return "FileText"
      default: return "Activity"
    }
  }

  const getActivityColor = (type) => {
    switch (type) {
      case "call": return "text-green-600 bg-green-100"
      case "email": return "text-blue-600 bg-blue-100"
      case "meeting": return "text-purple-600 bg-purple-100"
      case "note": return "text-gray-600 bg-gray-100"
      default: return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="p-4 hover:shadow-md transition-all duration-200">
        <div className="flex items-start space-x-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
            <ApperIcon name={getActivityIcon(activity.type)} className="w-5 h-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div>
                {showContact && (
                  <h4 className="font-semibold text-gray-900">
                    {activity.contactName}
                  </h4>
                )}
                {showContact && (
                  <p className="text-sm text-gray-600 mb-1">
                    {activity.contactCompany}
                  </p>
                )}
                <p className="text-sm font-medium text-gray-700 capitalize">
                  {activity.type}
                </p>
              </div>
              <div className="text-xs text-gray-500 text-right">
                <div>{format(new Date(activity.timestamp), "MMM d, yyyy")}</div>
                <div>{format(new Date(activity.timestamp), "h:mm a")}</div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 leading-relaxed">
              {activity.content}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default ActivityCard