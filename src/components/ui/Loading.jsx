import { motion } from "framer-motion"

const Loading = ({ type = "default" }) => {
  if (type === "pipeline") {
    return (
      <div className="flex space-x-6 p-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex-1">
            <div className="h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="bg-white rounded-lg p-4 shadow-sm border animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === "table") {
    return (
      <div className="animate-pulse">
        <div className="flex space-x-4 mb-4">
          <div className="h-10 bg-gray-200 rounded flex-1"></div>
          <div className="h-10 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 border-b">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="grid grid-cols-5 gap-4 p-4 border-b border-gray-100">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (type === "activities") {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm border animate-pulse"
          >
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
      />
    </div>
  )
}

export default Loading