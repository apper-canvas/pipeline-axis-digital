import { createBrowserRouter } from "react-router-dom"
import { lazy, Suspense } from "react"
import Layout from "@/components/organisms/Layout"

const PipelinePage = lazy(() => import("@/components/pages/PipelinePage"))
const ContactsPage = lazy(() => import("@/components/pages/ContactsPage"))
const ActivitiesPage = lazy(() => import("@/components/pages/ActivitiesPage"))
const NotFound = lazy(() => import("@/components/pages/NotFound"))

const mainRoutes = [
  {
    path: "",
    index: true,
    element: <Suspense fallback={<div>Loading.....</div>}><PipelinePage /></Suspense>
  },
  {
    path: "contacts",
    element: <Suspense fallback={<div>Loading.....</div>}><ContactsPage /></Suspense>
  },
  {
    path: "activities",
    element: <Suspense fallback={<div>Loading.....</div>}><ActivitiesPage /></Suspense>
  },
  {
    path: "*",
    element: <Suspense fallback={<div>Loading.....</div>}><NotFound /></Suspense>
  }
]

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [...mainRoutes]
  }
]

export const router = createBrowserRouter(routes)