import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { DashboardHub } from "@/pages/DashboardHub"
import { UsersList } from "@/pages/UsersList"
import { ClubsList } from "@/pages/ClubsList"
import { EventsList } from "@/pages/EventsList"
import { Settings } from "@/pages/Settings"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<DashboardHub />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/clubs" element={<ClubsList />} />
            <Route path="/events" element={<EventsList />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </DashboardLayout>
      </Router>
    </QueryClientProvider>
  )
}

export default App
