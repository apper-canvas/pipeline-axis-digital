import dealsData from "@/services/mockData/deals.json"
import contactsData from "@/services/mockData/contacts.json"

class DealService {
  constructor() {
    this.deals = [...dealsData]
    this.contacts = [...contactsData]
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getAll() {
    await this.delay()
    return this.deals.map(deal => {
      const contact = this.contacts.find(c => c.Id === deal.contactId)
      return {
        ...deal,
        contactName: contact?.name || "Unknown Contact",
        contactCompany: contact?.company || "Unknown Company"
      }
    })
  }

  async getById(id) {
    await this.delay()
    const deal = this.deals.find(d => d.Id === parseInt(id))
    if (!deal) return null

    const contact = this.contacts.find(c => c.Id === deal.contactId)
    return {
      ...deal,
      contactName: contact?.name || "Unknown Contact",
      contactCompany: contact?.company || "Unknown Company"
    }
  }

  async create(dealData) {
    await this.delay()
    const newDeal = {
      Id: Math.max(...this.deals.map(d => d.Id)) + 1,
      ...dealData,
      stage: dealData.stage || "lead",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.deals.push(newDeal)
    
    const contact = this.contacts.find(c => c.Id === newDeal.contactId)
    return {
      ...newDeal,
      contactName: contact?.name || "Unknown Contact",
      contactCompany: contact?.company || "Unknown Company"
    }
  }

  async update(id, dealData) {
    await this.delay()
    const index = this.deals.findIndex(d => d.Id === parseInt(id))
    if (index === -1) throw new Error("Deal not found")
    
    this.deals[index] = {
      ...this.deals[index],
      ...dealData,
      updatedAt: new Date().toISOString()
    }
    
    const contact = this.contacts.find(c => c.Id === this.deals[index].contactId)
    return {
      ...this.deals[index],
      contactName: contact?.name || "Unknown Contact",
      contactCompany: contact?.company || "Unknown Company"
    }
  }

  async updateStage(id, newStage) {
    await this.delay(200)
    const index = this.deals.findIndex(d => d.Id === parseInt(id))
    if (index === -1) throw new Error("Deal not found")
    
    this.deals[index] = {
      ...this.deals[index],
      stage: newStage,
      updatedAt: new Date().toISOString()
    }
    
    const contact = this.contacts.find(c => c.Id === this.deals[index].contactId)
    return {
      ...this.deals[index],
      contactName: contact?.name || "Unknown Contact",
      contactCompany: contact?.company || "Unknown Company"
    }
  }

  async delete(id) {
    await this.delay()
    const index = this.deals.findIndex(d => d.Id === parseInt(id))
    if (index === -1) throw new Error("Deal not found")
    
    this.deals.splice(index, 1)
    return true
  }

  async getByStage(stage) {
    await this.delay(200)
    return this.deals
      .filter(deal => deal.stage === stage)
      .map(deal => {
        const contact = this.contacts.find(c => c.Id === deal.contactId)
        return {
          ...deal,
          contactName: contact?.name || "Unknown Contact",
          contactCompany: contact?.company || "Unknown Company"
        }
      })
  }

  async getTotalValue() {
    await this.delay(200)
    return this.deals
      .filter(deal => !["closed-lost"].includes(deal.stage))
      .reduce((total, deal) => total + deal.value, 0)
  }
}

export default new DealService()