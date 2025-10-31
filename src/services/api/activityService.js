import activitiesData from "@/services/mockData/activities.json"
import contactsData from "@/services/mockData/contacts.json"

class ActivityService {
  constructor() {
    this.activities = [...activitiesData]
    this.contacts = [...contactsData]
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getAll() {
    await this.delay()
    return this.activities
      .map(activity => {
        const contact = this.contacts.find(c => c.Id === activity.contactId)
        return {
          ...activity,
          contactName: contact?.name || "Unknown Contact",
          contactCompany: contact?.company || "Unknown Company"
        }
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  async getById(id) {
    await this.delay()
    const activity = this.activities.find(a => a.Id === parseInt(id))
    if (!activity) return null

    const contact = this.contacts.find(c => c.Id === activity.contactId)
    return {
      ...activity,
      contactName: contact?.name || "Unknown Contact",
      contactCompany: contact?.company || "Unknown Company"
    }
  }

  async getByContactId(contactId) {
    await this.delay(200)
    return this.activities
      .filter(activity => activity.contactId === parseInt(contactId))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  async create(activityData) {
    await this.delay()
    const newActivity = {
      Id: Math.max(...this.activities.map(a => a.Id)) + 1,
      ...activityData,
      timestamp: activityData.timestamp || new Date().toISOString()
    }
    this.activities.push(newActivity)
    
    const contact = this.contacts.find(c => c.Id === newActivity.contactId)
    return {
      ...newActivity,
      contactName: contact?.name || "Unknown Contact",
      contactCompany: contact?.company || "Unknown Company"
    }
  }

  async update(id, activityData) {
    await this.delay()
    const index = this.activities.findIndex(a => a.Id === parseInt(id))
    if (index === -1) throw new Error("Activity not found")
    
    this.activities[index] = {
      ...this.activities[index],
      ...activityData
    }
    
    const contact = this.contacts.find(c => c.Id === this.activities[index].contactId)
    return {
      ...this.activities[index],
      contactName: contact?.name || "Unknown Contact",
      contactCompany: contact?.company || "Unknown Company"
    }
  }

  async delete(id) {
    await this.delay()
    const index = this.activities.findIndex(a => a.Id === parseInt(id))
    if (index === -1) throw new Error("Activity not found")
    
    this.activities.splice(index, 1)
    return true
  }

  async getByType(type) {
    await this.delay(200)
    return this.activities
      .filter(activity => activity.type === type)
      .map(activity => {
        const contact = this.contacts.find(c => c.Id === activity.contactId)
        return {
          ...activity,
          contactName: contact?.name || "Unknown Contact",
          contactCompany: contact?.company || "Unknown Company"
        }
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }
}

export default new ActivityService()