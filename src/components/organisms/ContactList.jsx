import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import contactService from "@/services/api/contactService"
import ContactCard from "@/components/molecules/ContactCard"
import SearchBar from "@/components/molecules/SearchBar"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"
import ApperIcon from "@/components/ApperIcon"
import { motion, AnimatePresence } from "framer-motion"

const ContactList = ({ onContactClick, onEditContact, onDeleteContact, refreshTrigger }) => {
  const [contacts, setContacts] = useState([])
  const [filteredContacts, setFilteredContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [viewMode, setViewMode] = useState("grid") // grid or table

  const loadContacts = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await contactService.getAll()
      setContacts(data)
      setFilteredContacts(data)
    } catch (err) {
      setError("Failed to load contacts. Please try again.")
      console.error("Error loading contacts:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContacts()
  }, [refreshTrigger])

  useEffect(() => {
    let filtered = [...contacts]
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (sortBy === "lastActivity") {
        aValue = new Date(a.lastActivity)
        bValue = new Date(b.lastActivity)
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    setFilteredContacts(filtered)
  }, [contacts, searchQuery, sortBy, sortOrder])

  const handleDelete = async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) {
      return
    }

    try {
      await contactService.delete(contactId)
      setContacts(prev => prev.filter(c => c.Id !== contactId))
      toast.success("Contact deleted successfully")
    } catch (err) {
      toast.error("Failed to delete contact")
      console.error("Error deleting contact:", err)
    }
  }

  if (loading) {
    return <Loading type="table" />
  }

  if (error) {
    return <Error message={error} onRetry={loadContacts} />
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1 max-w-md">
          <SearchBar
            placeholder="Search contacts..."
            onSearch={setSearchQuery}
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-40"
          >
            <option value="name">Name</option>
            <option value="company">Company</option>
            <option value="lastActivity">Last Activity</option>
            <option value="createdAt">Created</option>
          </Select>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            <ApperIcon 
              name={sortOrder === "asc" ? "ArrowUp" : "ArrowDown"} 
              className="w-4 h-4" 
            />
          </Button>

          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded transition-colors ${
                viewMode === "grid" 
                  ? "bg-white text-primary shadow-sm" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <ApperIcon name="Grid3X3" className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded transition-colors ${
                viewMode === "table" 
                  ? "bg-white text-primary shadow-sm" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <ApperIcon name="List" className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      {searchQuery && (
        <div className="text-sm text-gray-600">
          {filteredContacts.length} contact{filteredContacts.length !== 1 ? "s" : ""} found
        </div>
      )}

      {/* Contact List */}
      {filteredContacts.length === 0 ? (
        <Empty
          title={searchQuery ? "No contacts found" : "No contacts yet"}
          description={
            searchQuery 
              ? "Try adjusting your search terms"
              : "Start building your network by adding your first contact"
          }
          icon="Users"
        />
      ) : (
        <AnimatePresence>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContacts.map((contact) => (
                <ContactCard
                  key={contact.Id}
                  contact={contact}
                  onClick={onContactClick}
                  onEdit={onEditContact}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tags
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredContacts.map((contact) => (
                      <motion.tr
                        key={contact.Id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => onContactClick(contact)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {contact.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {contact.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {contact.company}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {contact.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {contact.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {tag}
                              </span>
                            ))}
                            {contact.tags.length > 2 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                +{contact.tags.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                onEditContact(contact)
                              }}
                              className="text-gray-400 hover:text-primary"
                            >
                              <ApperIcon name="Edit2" className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(contact.Id)
                              }}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <ApperIcon name="Trash2" className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

export default ContactList