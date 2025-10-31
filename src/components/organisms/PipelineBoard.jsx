import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-toastify"
import dealService from "@/services/api/dealService"
import DealCard from "@/components/molecules/DealCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"

const PipelineBoard = ({ onEditDeal, onDeleteDeal, refreshTrigger }) => {
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [draggedDeal, setDraggedDeal] = useState(null)

  const stages = [
    { id: "lead", name: "Lead", color: "bg-gray-50 border-gray-200" },
    { id: "qualified", name: "Qualified", color: "bg-blue-50 border-blue-200" },
    { id: "proposal", name: "Proposal", color: "bg-yellow-50 border-yellow-200" },
    { id: "negotiation", name: "Negotiation", color: "bg-orange-50 border-orange-200" },
    { id: "closed-won", name: "Closed Won", color: "bg-green-50 border-green-200" }
  ]

  const loadDeals = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await dealService.getAll()
      setDeals(data)
    } catch (err) {
      setError("Failed to load deals. Please try again.")
      console.error("Error loading deals:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDeals()
  }, [refreshTrigger])

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = async (e, newStage) => {
    e.preventDefault()
    
    if (!draggedDeal || draggedDeal.stage === newStage) {
      setDraggedDeal(null)
      return
    }

    try {
      const updatedDeal = await dealService.updateStage(draggedDeal.Id, newStage)
      
      setDeals(prevDeals =>
        prevDeals.map(deal =>
          deal.Id === draggedDeal.Id ? updatedDeal : deal
        )
      )
      
      toast.success(`Deal moved to ${stages.find(s => s.id === newStage)?.name}`)
    } catch (err) {
      toast.error("Failed to update deal stage")
      console.error("Error updating deal stage:", err)
    } finally {
      setDraggedDeal(null)
    }
  }

  const getDealsByStage = (stageId) => {
    return deals.filter(deal => deal.stage === stageId)
  }

  const getStageTotal = (stageId) => {
    const stageDeals = getDealsByStage(stageId)
    return stageDeals.reduce((total, deal) => total + deal.value, 0)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  if (loading) {
    return <Loading type="pipeline" />
  }

  if (error) {
    return <Error message={error} onRetry={loadDeals} />
  }

  if (deals.length === 0) {
    return (
      <Empty
        title="No deals in pipeline"
        description="Start tracking your sales opportunities by adding your first deal"
        icon="BarChart3"
      />
    )
  }

  return (
    <div className="flex space-x-6 overflow-x-auto pb-6">
      {stages.map((stage) => {
        const stageDeals = getDealsByStage(stage.id)
        const stageTotal = getStageTotal(stage.id)
        
        return (
          <div
            key={stage.id}
            className="flex-shrink-0 w-80"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            <div className={`rounded-lg border-2 ${stage.color} p-4 h-full min-h-[500px]`}>
              {/* Stage Header */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                  <span className="text-sm text-gray-500">
                    {stageDeals.length}
                  </span>
                </div>
                {stageTotal > 0 && (
                  <div className="text-sm font-medium text-gray-700">
                    {formatCurrency(stageTotal)}
                  </div>
                )}
              </div>

              {/* Deal Cards */}
              <div className="space-y-3">
                <AnimatePresence>
                  {stageDeals.map((deal) => (
                    <motion.div
                      key={deal.Id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal)}
                      className={draggedDeal?.Id === deal.Id ? "dragging" : ""}
                    >
                      <DealCard
                        deal={deal}
                        onEdit={onEditDeal}
                        onDelete={onDeleteDeal}
                        isDragging={draggedDeal?.Id === deal.Id}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Empty State */}
              {stageDeals.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm">
                    <ApperIcon name="Plus" className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">No deals in this stage</p>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PipelineBoard