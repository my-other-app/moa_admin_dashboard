import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardHub } from "@/pages/DashboardHub"
import { UsersList } from "@/pages/UsersList"
import { ClubsList } from "@/pages/ClubsList"
import { EventsList } from "@/pages/EventsList"
import { Settings } from "@/pages/Settings"
import { Login } from "@/pages/Login"
import { OrganizationsList } from "@/pages/OrganizationsList"
import { AvatarsList } from "@/pages/AvatarsList"
import { BadgesList } from "@/pages/BadgesList"
import { Toaster } from "@/components/ui/sonner"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={
              <DashboardLayout>
                <DashboardHub />
              </DashboardLayout>
            } />
            <Route path="/users" element={
              <DashboardLayout>
                <UsersList />
              </DashboardLayout>
            } />
            <Route path="/clubs" element={
              <DashboardLayout>
                <ClubsList />
              </DashboardLayout>
            } />
            <Route path="/events" element={
              <DashboardLayout>
                <EventsList />
              </DashboardLayout>
            } />
            <Route path="/organizations" element={
              <DashboardLayout>
                <OrganizationsList />
              </DashboardLayout>
            } />
            <Route path="/avatars" element={
              <DashboardLayout>
                <AvatarsList />
              </DashboardLayout>
            } />
            <Route path="/badges" element={
              <DashboardLayout>
                <BadgesList />
              </DashboardLayout>
            } />
            <Route path="/settings" element={
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            } />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
