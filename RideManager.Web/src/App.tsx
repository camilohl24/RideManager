import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/auth/LoginPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import OwnersPage from './pages/owners/OwnersPage'
import MainLayout from './layouts/MainLayout'
import { useAuthStore } from './store/authStore'
import MotorcyclesPage from './pages/motorcycles/MotorcyclesPage'
import MechanicsPage from './pages/mechanics/MechanicsPage'
import WorkOrdersPage from './pages/workOrders/WorkOrdersPage'
function App() {
  const token = useAuthStore((state) => state.token)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={token ? <MainLayout /> : <Navigate to="/login" />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/owners" element={<OwnersPage />} />
          <Route path="/motorcycles" element={<MotorcyclesPage />} />
          <Route path="/mechanics" element={<MechanicsPage />} />
          <Route path="/workOrders" element={<WorkOrdersPage />} />
        </Route>
        <Route
          path="*"
          element={<Navigate to={token ? '/dashboard' : '/login'} />}
        />
      </Routes>
    </BrowserRouter>
  )
}
export default App
