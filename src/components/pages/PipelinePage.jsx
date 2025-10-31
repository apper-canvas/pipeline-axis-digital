import { useState } from "react"
import PipelineBoard from "@/components/organisms/PipelineBoard"
import ApperIcon from "@/components/ApperIcon"

const PipelinePage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const handleEditDeal = (deal) => {
    // TODO: Implement edit deal modal
    console.log("Edit deal:", deal)
  }

  const handleDeleteDeal = (dealId) => {
    // TODO: Implement delete deal functionality
    console.log("Delete deal:", dealId)
    // Refresh the board after deletion
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Pipeline</h1>
          <p className="text-gray-600 mt-2">
            Track and manage your deals from lead to close
          </p>
        </div>
        
        <button
          onClick={handleRefresh}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ApperIcon name="RefreshCw" className="w-4 h-4" />
          <span className="text-sm">Refresh</span>
        </button>
      </div>

      {/* Pipeline Board */}
      <PipelineBoard
        onEditDeal={handleEditDeal}
        onDeleteDeal={handleDeleteDeal}
        refreshTrigger={refreshTrigger}
      />
    </div>
  )
}

export default PipelinePage