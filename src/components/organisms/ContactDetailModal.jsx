import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { format } from "date-fns"
import Modal from "@/components/molecules/Modal"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Badge from "@/components/atoms/Badge"
import ActivityCard from "@/components/molecules/ActivityCard"
import Loading from "@/components/ui/Loading"
import ApperIcon from "@/components/ApperIcon"
import contactService from "@/services/api/contactService"
import activityService from "@/services/api/activityService"

const ContactDetailModal = ({ contact, isOpen, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState("info")
  const [contactData, setContactData] = useState(null)
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [showActivityForm, setShowActivityForm] = useState(false)
  const [activityForm, setActivityForm] = useState({
    type: "note",
    content: ""
  })

  const tabs = [
    { id: "info", name: "Contact Info", icon: "User" },
    { id: "activities", name: "Activities", icon: "Activity" },
    { id: "deals", name: "Deals", icon: "BarChart3" }
  ]

  useEffect(() => {
    if (contact && isOpen) {
      loadContactDetails()
      setActiveTab("info")
      setIsEditing(false)
      setShowActivityForm(false)
    }
  }, [contact, isOpen])

  const loadContactDetails = async () => {
    if (!contact) return
    
    try {
      setLoading(true)
      const data = await contactService.getById(contact.Id)
      setContactData(data)
      setEditForm({
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        tags: data.tags.join(", ")
      })
      setActivities(data.activities || [])
    } catch (err) {
      toast.error("Failed to load contact details")
      console.error("Error loading contact:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveEdit = async () => {
    try {
      const updatedData = {
        ...editForm,
        tags: editForm.tags.split(",").map(tag => tag.trim()).filter(tag => tag)
      }
      
      const updated = await contactService.update(contact.Id, updatedData)
      setContactData(updated)
      setIsEditing(false)
      onUpdate?.(updated)
      toast.success("Contact updated successfully")
    } catch (err) {
      toast.error("Failed to update contact")
      console.error("Error updating contact:", err)
    }
  }

  const handleAddActivity = async () => {
    if (!activityForm.content.trim()) {
      toast.error("Please enter activity content")
      return
    }

    try {
      const newActivity = await activityService.create({
        contactId: contact.Id,
        type: activityForm.type,
        content: activityForm.content
      })
      
      setActivities([newActivity, ...activities])
      setActivityForm({ type: "note", content: "" })
      setShowActivityForm(false)
      toast.success("Activity logged successfully")
    } catch (err) {
      toast.error("Failed to log activity")
      console.error("Error creating activity:", err)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (!contact) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={contactData?.name || "Contact Details"}
      size="xl"
    >
      {loading ? (
        <Loading />
      ) : (
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <ApperIcon name={tab.icon} className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === "info" && contactData && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Contact Information
                  </h3>
                  <p className="text-sm text-gray-500">
                    Created {format(new Date(contactData.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <ApperIcon name={isEditing ? "X" : "Edit2"} className="w-4 h-4 mr-2" />
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    label="Name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  />
                  <Input
                    label="Phone"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  />
                  <Input
                    label="Company"
                    value={editForm.company}
                    onChange={(e) => setEditForm({...editForm, company: e.target.value})}
                  />
                  <Input
                    label="Tags (comma separated)"
                    value={editForm.tags}
                    onChange={(e) => setEditForm({...editForm, tags: e.target.value})}
                  />
                  <div className="flex space-x-3">
                    <Button onClick={handleSaveEdit}>
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Email
                    </label>
                    <p className="text-sm text-gray-900">{contactData.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Phone
                    </label>
                    <p className="text-sm text-gray-900">{contactData.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Company
                    </label>
                    <p className="text-sm text-gray-900">{contactData.company}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-1">
                      {contactData.tags.map((tag) => (
                        <Badge key={tag} variant="default" size="sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "activities" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Activities</h3>
                <Button
                  size="sm"
                  onClick={() => setShowActivityForm(!showActivityForm)}
                >
                  <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                  Log Activity
                </Button>
              </div>

              {showActivityForm && (
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <select
                    value={activityForm.type}
                    onChange={(e) => setActivityForm({...activityForm, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="call">Call</option>
                    <option value="email">Email</option>
                    <option value="meeting">Meeting</option>
                    <option value="note">Note</option>
                  </select>
                  <textarea
                    value={activityForm.content}
                    onChange={(e) => setActivityForm({...activityForm, content: e.target.value})}
                    placeholder="Describe the activity..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary h-20"
                  />
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={handleAddActivity}>
                      Save Activity
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowActivityForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {activities.map((activity) => (
                  <ActivityCard
                    key={activity.Id}
                    activity={activity}
                    showContact={false}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === "deals" && contactData && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Deals</h3>
              {contactData.deals && contactData.deals.length > 0 ? (
                <div className="space-y-3">
                  {contactData.deals.map((deal) => (
                    <div key={deal.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{deal.title}</h4>
                        <p className="text-sm text-gray-500 capitalize">{deal.stage.replace("-", " ")}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(deal.value)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(deal.updatedAt), "MMM d")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No deals found for this contact</p>
              )}
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}

export default ContactDetailModal