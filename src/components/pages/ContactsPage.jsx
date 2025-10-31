import { useState } from "react"
import ContactList from "@/components/organisms/ContactList"
import ContactDetailModal from "@/components/organisms/ContactDetailModal"

const ContactsPage = () => {
  const [selectedContact, setSelectedContact] = useState(null)
  const [showContactDetail, setShowContactDetail] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleContactClick = (contact) => {
    setSelectedContact(contact)
    setShowContactDetail(true)
  }

  const handleEditContact = (contact) => {
    setSelectedContact(contact)
    setShowContactDetail(true)
  }

  const handleDeleteContact = (contactId) => {
    // This will be handled by the ContactList component
    setRefreshTrigger(prev => prev + 1)
  }

  const handleContactUpdate = (updatedContact) => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
        <p className="text-gray-600 mt-2">
          Manage your customer relationships and contact information
        </p>
      </div>

      {/* Contact List */}
      <ContactList
        onContactClick={handleContactClick}
        onEditContact={handleEditContact}
        onDeleteContact={handleDeleteContact}
        refreshTrigger={refreshTrigger}
      />

      {/* Contact Detail Modal */}
      <ContactDetailModal
        contact={selectedContact}
        isOpen={showContactDetail}
        onClose={() => {
          setShowContactDetail(false)
          setSelectedContact(null)
        }}
        onUpdate={handleContactUpdate}
      />
    </div>
  )
}

export default ContactsPage