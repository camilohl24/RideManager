import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function MainLayout() {
  return (
    <div className="bg[#0d0f14] flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto bg-[#0d0f14] p-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
