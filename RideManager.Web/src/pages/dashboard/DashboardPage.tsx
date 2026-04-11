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
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const STATUS_STYLE: Record<string, string> = {
  Pending: 'bg-yellow-500/15 text-yellow-400 hover:bg-yellow-500/15',
  InRepair: 'bg-purple-500/15 text-purple-400 hover:bg-purple-500/15',
  Done: 'bg-green-500/15 text-green-400 hover:bg-green-500/15',
  ReadyForDelivery: 'bg-blue-500/15 text-blue-400 hover:bg-blue-500/15',
}

const STATUS_LABELS: Record<string, string> = {
  Pendind: 'Pendiente',
  InRepair: 'En reparacion',
  Done: 'Finalizado',
  ReadyForDelivery: 'Listo para entrega',
}

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
      <Card className="border-[#2a2d3a] bg-[#181b26] p-4">
        <p className="mb-3 text-xs font-medium tracking-wider text-gray-400 uppercase">
          Ultimas ordenes y estado
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-400">Nro.</TableHead>
              <TableHead className="text-gray-400">Fecha</TableHead>
              <TableHead className="text-gray-400">Moto</TableHead>
              <TableHead className="text-gray-400">Mecanico</TableHead>
              <TableHead className="text-gray-400">Estado</TableHead>
              <TableHead className="text-gray-400">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workOrders.slice(0, 5).map((order) => (
              <TableRow key={order.id} className="border-[#2a2d3a]">
                <TableCell className="text-gray-300">{order.id}</TableCell>
                <TableCell className="text-gray-300">
                  {new Date(order.createdAt).toLocaleDateString('es-CO')}
                </TableCell>
                <TableCell className="text-gray-300">
                  {order.licensePlate}
                </TableCell>
                <TableCell className="text-gray-300">
                  {order.fullNameMechanic}
                </TableCell>
                <TableCell>
                  <Badge className={STATUS_STYLE[order.status]}>
                    {STATUS_LABELS[order.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-300">
                  <button className="text-xs text-orange-500 hover:text-orange-400">
                    Ver
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
