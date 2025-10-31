import { useState } from "react"
import ActivityFeed from "@/components/organisms/ActivityFeed"

const ActivitiesPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  return (
    <div className="space-y-6">
      <ActivityFeed refreshTrigger={refreshTrigger} />
    </div>
  )
}

export default ActivitiesPage