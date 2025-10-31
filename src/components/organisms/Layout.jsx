import { useState } from "react"
import { Outlet } from "react-router-dom"
import Header from "@/components/organisms/Header"
import QuickAddModal from "@/components/organisms/QuickAddModal"

const Layout = () => {
  const [showQuickAdd, setShowQuickAdd] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Header onQuickAdd={() => setShowQuickAdd(true)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <QuickAddModal
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
      />
    </div>
  )
}

export default Layout