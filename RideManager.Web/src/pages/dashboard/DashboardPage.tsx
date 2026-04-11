import { getAppointments } from '@/services/appointmentService'
import { getWorkOrders } from '@/services/workOrderService'
import { getOwners } from '@/services/ownerService'
import { getMechanics } from '@/services/mechanicService'
import { getMotorcycles } from '@/services/motorcycleService'
import { useEffect, useState } from 'react'
import {
  type MechanicResponse,
  type AppointmentResponse,
  type OwnerResponse,
  type WorkOrderResponse,
  type MotorcycleResponse,
} from '@/types/api'
import { WorkOrderStatus } from '@/types/enums'
import { Card } from '@/components/ui/card'

export default function DashboardPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrderResponse[]>([])
  const [owners, setOwners] = useState<OwnerResponse[]>([])
  const [mechanics, setMechanics] = useState<MechanicResponse[]>([])
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([])
  const [motorcycles, setMotorcycles] = useState<MotorcycleResponse[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const workOrders = await getWorkOrders()
        const appointments = await getAppointments()
        const owners = await getOwners()
        const mechanics = await getMechanics()
        const motorcycles = await getMotorcycles()
        setWorkOrders(workOrders)
        setAppointments(appointments)
        setOwners(owners)
        setMechanics(mechanics)
        setMotorcycles(motorcycles)
      } catch (error) {
        console.error('Error al cargar datos:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const activeOrders = workOrders.filter(
    (o) =>
      o.status !== WorkOrderStatus.Done &&
      o.status !== WorkOrderStatus.ReadyForDelivery
  ).length

  const now = new Date()
  const today = now.toDateString()

  const completedToday = workOrders.filter(
    (o) =>
      o.status == WorkOrderStatus.Done &&
      new Date(o.completedAt!).toDateString() === today
  ).length

  const newClients = owners.filter(
    (o) =>
      new Date(o.createdAt).getMonth() === now.getMonth() &&
      new Date(o.createdAt).getFullYear() === now.getFullYear()
  ).length

  const tomorrow = new Date(now)
  tomorrow.setDate(now.getDate() + 1)

  const tomorrowAppointments = appointments.filter(
    (a) => new Date(a.scheduledAt!).toDateString() === tomorrow.toDateString()
  ).length

  const totalOrders = workOrders.length

  const registeredClients = owners.length

  const totalMechanics = mechanics.length

  const motorcyclesInShop = motorcycles.filter((m) =>
    m.workOrdersId?.some((id) =>
      workOrders.find(
        (o) =>
          o.id === id &&
          o.status !== WorkOrderStatus.Done &&
          o.status !== WorkOrderStatus.ReadyForDelivery
      )
    )
  ).length

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-gray-500">Cargando...</p>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Card className="flex flex-row items-center gap-4 border-[#2a2d3a] bg-[#181b26] p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-sm">
            🕐
          </div>
          <div className="flex-1">
            <p className="mb-1 text-xs text-gray-500">órdenes activas</p>
            <p className="text-2xl font-semibold text-white">{activeOrders}</p>
          </div>
          <span className="text-lg text-green-400">↗</span>
        </Card>
        <Card className="flex flex-row items-center gap-4 border-[#2a2d3a] bg-[#181b26] p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-sm">
            ✅
          </div>
          <div className="flex-1">
            <p className="mb-1 text-xs text-gray-500">Completadas hoy</p>
            <p className="text-2xl font-semibold text-white">
              {completedToday}
            </p>
          </div>
          <span className="text-lg text-green-400">↗</span>
        </Card>
        <Card className="flex flex-row items-center gap-4 border-[#2a2d3a] bg-[#181b26] p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 text-sm">
            👤
          </div>
          <div className="flex-1">
            <p className="mb-1 text-xs text-gray-500">Clientes nuevos</p>
            <p className="text-2xl font-semibold text-white">{newClients}</p>
          </div>
          <span className="text-lg text-green-400">↗</span>
        </Card>
        <Card className="flex flex-row items-center gap-4 border-[#2a2d3a] bg-[#181b26] p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-sm">
            📅
          </div>
          <div className="flex-1">
            <p className="mb-1 text-xs text-gray-500">Citas mañana</p>
            <p className="text-2xl font-semibold text-white">
              {tomorrowAppointments}
            </p>
          </div>
          <span className="text-lg text-red-400">↘</span>
        </Card>
      </div>
      <div className="grid grid-cols-4 gap-3">
        <Card className="border-[#2a2d3a] bg-[#181b26] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-base">📋</span>
            <span className="text-sm text-gray-600">≡</span>
          </div>
          <p className="text-2xl font-semibold text-white">{totalOrders}</p>
          <p className="mt-1 text-xs text-gray-500">Total órdenes</p>
        </Card>
        <Card className="border-[#2a2d3a] bg-[#181b26] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-base">👥</span>
            <span className="text-sm text-gray-600">👤</span>
          </div>
          <p className="text-2xl font-semibold text-white">
            {registeredClients}
          </p>
          <p className="mt-1 text-xs text-gray-500">Clientes registrados</p>
        </Card>
        <Card className="border-[#2a2d3a] bg-[#181b26] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-base">🏍</span>
            <span className="text-sm text-gray-600">🏍</span>
          </div>
          <p className="text-2xl font-semibold text-white">
            {motorcyclesInShop}
          </p>
          <p className="mt-1 text-xs text-gray-500">Motos en taller</p>
        </Card>
        <Card className="border-[#2a2d3a] bg-[#181b26] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-base">🔧</span>
            <span className="text-sm text-gray-600">👥</span>
          </div>
          <p className="text-2xl font-semibold text-white">{totalMechanics}</p>
          <p className="mt-1 text-xs text-gray-500">Mecanicos disponibles</p>
        </Card>
      </div>
    </div>
  )
}
