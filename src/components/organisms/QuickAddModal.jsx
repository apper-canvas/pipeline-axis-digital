import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Modal from "@/components/molecules/Modal";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import contactService from "@/services/api/contactService";
import dealService from "@/services/api/dealService";
import activityService from "@/services/api/activityService";

const QuickAddModal = ({ isOpen, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState("contact")
  const [loading, setLoading] = useState(false)
  
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    tags: ""
  })
  
  const [dealForm, setDealForm] = useState({
    contactId: "",
    title: "",
    value: "",
    stage: "lead"
  })
  
  const [activityForm, setActivityForm] = useState({
    contactId: "",
    type: "note",
    content: ""
  })

  const [contacts, setContacts] = useState([])

  const tabs = [
    { id: "contact", name: "Contact", icon: "User" },
    { id: "deal", name: "Deal", icon: "BarChart3" },
    { id: "activity", name: "Activity", icon: "Activity" }
  ]

  const stages = [
    { value: "lead", label: "Lead" },
    { value: "qualified", label: "Qualified" },
    { value: "proposal", label: "Proposal" },
    { value: "negotiation", label: "Negotiation" }
  ]

  const activityTypes = [
    { value: "call", label: "Call" },
    { value: "email", label: "Email" },
    { value: "meeting", label: "Meeting" },
    { value: "note", label: "Note" }
  ]

  React.useEffect(() => {
    if (isOpen && (activeTab === "deal" || activeTab === "activity")) {
      loadContacts()
    }
  }, [isOpen, activeTab])

  const loadContacts = async () => {
    try {
      const data = await contactService.getAll()
      setContacts(data)
    } catch (err) {
      console.error("Error loading contacts:", err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (activeTab === "contact") {
        const contactData = {
          ...contactForm,
          tags: contactForm.tags.split(",").map(tag => tag.trim()).filter(tag => tag)
        }
        await contactService.create(contactData)
        toast.success("Contact created successfully")
        setContactForm({
          name: "",
          email: "",
          phone: "",
          company: "",
          tags: ""
        })
      } else if (activeTab === "deal") {
        const dealData = {
          ...dealForm,
          contactId: parseInt(dealForm.contactId),
          value: parseFloat(dealForm.value) || 0
        }
        await dealService.create(dealData)
        toast.success("Deal created successfully")
        setDealForm({
          contactId: "",
          title: "",
          value: "",
          stage: "lead"
        })
      } else if (activeTab === "activity") {
        const activityData = {
          ...activityForm,
          contactId: parseInt(activityForm.contactId)
        }
        await activityService.create(activityData)
        toast.success("Activity logged successfully")
        setActivityForm({
          contactId: "",
          type: "note",
          content: ""
        })
      }
      
      onSuccess?.()
      onClose()
    } catch (err) {
      toast.error(`Failed to create ${activeTab}`)
      console.error(`Error creating ${activeTab}:`, err)
    } finally {
      setLoading(false)
    }
  }

  const resetForms = () => {
    setContactForm({
      name: "",
      email: "",
      phone: "",
      company: "",
      tags: ""
    })
    setDealForm({
      contactId: "",
      title: "",
      value: "",
      stage: "lead"
    })
    setActivityForm({
      contactId: "",
      type: "note",
      content: ""
    })
  }

  React.useEffect(() => {
    if (!isOpen) {
      resetForms()
      setActiveTab("contact")
    }
  }, [isOpen])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Quick Add"
      size="md"
    >
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
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

      <form onSubmit={handleSubmit} className="space-y-4">
        {activeTab === "contact" && (
          <>
            <Input
              label="Name"
              value={contactForm.name}
              onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
              required
            />
            <Input
              label="Email"
              type="email"
              value={contactForm.email}
              onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
              required
            />
            <Input
              label="Phone"
              value={contactForm.phone}
              onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
            />
            <Input
              label="Company"
              value={contactForm.company}
              onChange={(e) => setContactForm({...contactForm, company: e.target.value})}
              required
            />
            <Input
              label="Tags (comma separated)"
              value={contactForm.tags}
              onChange={(e) => setContactForm({...contactForm, tags: e.target.value})}
              placeholder="enterprise, decision-maker, urgent"
            />
          </>
        )}

        {activeTab === "deal" && (
          <>
            <Select
              label="Contact"
              value={dealForm.contactId}
              onChange={(e) => setDealForm({...dealForm, contactId: e.target.value})}
              required
            >
              {contacts.map((contact) => (
                <option key={contact.Id} value={contact.Id}>
                  {contact.name} - {contact.company}
                </option>
              ))}
            </Select>
            <Input
              label="Deal Title"
              value={dealForm.title}
              onChange={(e) => setDealForm({...dealForm, title: e.target.value})}
              required
            />
            <Input
              label="Deal Value"
              type="number"
              value={dealForm.value}
              onChange={(e) => setDealForm({...dealForm, value: e.target.value})}
              required
            />
            <Select
              label="Stage"
              value={dealForm.stage}
              onChange={(e) => setDealForm({...dealForm, stage: e.target.value})}
            >
              {stages.map((stage) => (
                <option key={stage.value} value={stage.value}>
                  {stage.label}
                </option>
              ))}
            </Select>
          </>
        )}

        {activeTab === "activity" && (
          <>
            <Select
              label="Contact"
              value={activityForm.contactId}
              onChange={(e) => setActivityForm({...activityForm, contactId: e.target.value})}
              required
            >
              {contacts.map((contact) => (
                <option key={contact.Id} value={contact.Id}>
                  {contact.name} - {contact.company}
                </option>
              ))}
            </Select>
            <Select
              label="Activity Type"
              value={activityForm.type}
              onChange={(e) => setActivityForm({...activityForm, type: e.target.value})}
            >
              {activityTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <textarea
                value={activityForm.content}
                onChange={(e) => setActivityForm({...activityForm, content: e.target.value})}
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                rows="4"
                placeholder="Describe the activity..."
                required
              />
            </div>
          </>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : `Create ${activeTab}`}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default QuickAddModal