import contactsData from "@/services/mockData/contacts.json"
import dealsData from "@/services/mockData/deals.json"
import activitiesData from "@/services/mockData/activities.json"

class ContactService {
  constructor() {
    this.contacts = [...contactsData]
    this.deals = [...dealsData]
    this.activities = [...activitiesData]
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getAll() {
    await this.delay()
    return [...this.contacts]
  }

  async getById(id) {
    await this.delay()
    const contact = this.contacts.find(c => c.Id === parseInt(id))
    if (!contact) return null

    const contactDeals = this.deals.filter(d => d.contactId === parseInt(id))
    const contactActivities = this.activities.filter(a => a.contactId === parseInt(id))
    
    return {
      ...contact,
      deals: contactDeals,
      activities: contactActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    }
  }

  async create(contactData) {
    await this.delay()
    const newContact = {
      Id: Math.max(...this.contacts.map(c => c.Id)) + 1,
      ...contactData,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    }
    this.contacts.push(newContact)
    return { ...newContact }
  }

  async update(id, contactData) {
    await this.delay()
    const index = this.contacts.findIndex(c => c.Id === parseInt(id))
    if (index === -1) throw new Error("Contact not found")
    
    this.contacts[index] = {
      ...this.contacts[index],
      ...contactData,
      lastActivity: new Date().toISOString()
    }
    return { ...this.contacts[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.contacts.findIndex(c => c.Id === parseInt(id))
    if (index === -1) throw new Error("Contact not found")
    
    this.contacts.splice(index, 1)
    // Also remove related deals and activities
    this.deals = this.deals.filter(d => d.contactId !== parseInt(id))
    this.activities = this.activities.filter(a => a.contactId !== parseInt(id))
    return true
  }

  async search(query) {
    await this.delay(200)
    const lowercaseQuery = query.toLowerCase()
    return this.contacts.filter(contact =>
      contact.name.toLowerCase().includes(lowercaseQuery) ||
      contact.email.toLowerCase().includes(lowercaseQuery) ||
      contact.company.toLowerCase().includes(lowercaseQuery) ||
      contact.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
  }

  async filterByTags(tags) {
    await this.delay(200)
    if (!tags || tags.length === 0) return [...this.contacts]
    return this.contacts.filter(contact =>
      tags.some(tag => contact.tags.includes(tag))
    )
  }
}

export default new ContactService()