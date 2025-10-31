import { useState, useEffect } from "react"
import activityService from "@/services/api/activityService"
import ActivityCard from "@/components/molecules/ActivityCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import Select from "@/components/atoms/Select"
import ApperIcon from "@/components/ApperIcon"
import { motion, AnimatePresence } from "framer-motion"

const ActivityFeed = ({ refreshTrigger }) => {
  const [activities, setActivities] = useState([])
  const [filteredActivities, setFilteredActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filterType, setFilterType] = useState("all")

  const activityTypes = [
    { value: "all", label: "All Activities" },
    { value: "call", label: "Calls" },
    { value: "email", label: "Emails" },
    { value: "meeting", label: "Meetings" },
    { value: "note", label: "Notes" }
  ]

  const loadActivities = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await activityService.getAll()
      setActivities(data)
    } catch (err) {
      setError("Failed to load activities. Please try again.")
      console.error("Error loading activities:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadActivities()
  }, [refreshTrigger])

  useEffect(() => {
    let filtered = [...activities]
    
    if (filterType !== "all") {
      filtered = filtered.filter(activity => activity.type === filterType)
    }
    
    setFilteredActivities(filtered)
  }, [activities, filterType])

  if (loading) {
    return <Loading type="activities" />
  }

  if (error) {
    return <Error message={error} onRetry={loadActivities} />
  }

  return (
    <div className="space-y-6">
      {/* Header with Filter */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Activity Feed</h2>
          <p className="text-gray-600">Recent interactions and updates</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-40"
          >
            {activityTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        {filteredActivities.length} activit{filteredActivities.length !== 1 ? "ies" : "y"}
        {filterType !== "all" && ` (${activityTypes.find(t => t.value === filterType)?.label})`}
      </div>

      {/* Activity List */}
      {filteredActivities.length === 0 ? (
        <Empty
          title="No activities found"
          description={
            filterType === "all" 
              ? "Start logging your interactions with contacts"
              : `No ${filterType} activities found`
          }
          icon="Activity"
        />
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredActivities.map((activity, index) => (
              <motion.div
                key={activity.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <ActivityCard activity={activity} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default ActivityFeed