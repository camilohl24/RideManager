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
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import KpiCard from '@/components/dashboard/KpiCard'

const STATUS_STYLE: Record<string, string> = {
  Pending: 'bg-yellow-500/15 text-yellow-400 hover:bg-yellow-500/15',
  InRepair: 'bg-purple-500/15 text-purple-400 hover:bg-purple-500/15',
  Done: 'bg-green-500/15 text-green-400 hover:bg-green-500/15',
  ReadyForDelivery: 'bg-blue-500/15 text-blue-400 hover:bg-blue-500/15',
}

const STATUS_LABELS: Record<string, string> = {
  Pending: 'Pendiente',
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
    <div className="flex gap-4">
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <KpiCard
            icon="🕐"
            label="Órdenes activas"
            value={activeOrders}
            trend="up"
            color="blue"
          />
          <KpiCard
            icon="✅"
            label="Completadas hoy"
            value={completedToday}
            trend="up"
            color="green"
          />
          <KpiCard
            icon="👤"
            label="Clientes nuevos"
            value={newClients}
            trend="up"
            color="teal"
          />
          <KpiCard
            icon="📅"
            label="Citas mañana"
            value={tomorrowAppointments}
            trend="down"
            color="red"
          />
        </div>
        <div className="grid grid-cols-4 gap-3">
          <Card className="border-[#2a2d3a] bg-[#181b26] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-green-500/10 text-sm">
                📋
              </span>
              <span className="text-sm text-gray-600">≡</span>
            </div>
            <p className="text-2xl font-semibold text-white">{totalOrders}</p>
            <p className="mt-1 text-xs text-gray-500">Total órdenes</p>
          </Card>
          <Card className="border-[#2a2d3a] bg-[#181b26] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-red-500/10 text-sm">
                👥
              </span>
              <span className="text-sm text-gray-600">👤</span>
            </div>
            <p className="text-2xl font-semibold text-white">
              {registeredClients}
            </p>
            <p className="mt-1 text-xs text-gray-500">Clientes registrados</p>
          </Card>
          <Card className="border-[#2a2d3a] bg-[#181b26] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-500/10 text-sm">
                🏍
              </span>
              <span className="text-sm text-gray-400">🏍</span>
            </div>
            <p className="text-2xl font-semibold text-white">
              {motorcyclesInShop}
            </p>
            <p className="mt-1 text-xs text-gray-500">Motos en taller</p>
          </Card>
          <Card className="border-[#2a2d3a] bg-[#181b26] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500/10 text-sm">
                🔧
              </span>
              <span className="text-sm text-gray-600">👥</span>
            </div>
            <p className="text-2xl font-semibold text-white">
              {totalMechanics}
            </p>
            <p className="mt-1 text-xs text-gray-500">Mecanicos disponibles</p>
          </Card>
        </div>
        <Card className="border-[#2a2d3a] bg-[#181b26] p-4">
          <p className="mb-3 text-xs font-medium tracking-wider text-gray-400 uppercase">
            Ultimas ordenes y estado
          </p>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-white/5">
                <TableHead className="text-gray-400">Nro.</TableHead>
                <TableHead className="text-gray-400">Fecha</TableHead>
                <TableHead className="text-gray-400">Moto</TableHead>
                <TableHead className="text-gray-400">Cliente</TableHead>
                <TableHead className="text-gray-400">Mecanico</TableHead>
                <TableHead className="text-gray-400">Estado</TableHead>
                <TableHead className="text-gray-400">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workOrders.slice(0, 5).map((order) => (
                <TableRow
                  key={order.id}
                  className="border-[#2a2d3a] hover:bg-white/5"
                >
                  <TableCell className="text-gray-300">{order.id}</TableCell>
                  <TableCell className="text-gray-300">
                    {new Date(order.createdAt).toLocaleDateString('es-CO')}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {order.licensePlate}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {order.ownerName ?? '-'}
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
      <div className="flex w-48 shrink-0 flex-col gap-4">
        <Card className="border-[#2a2d3a] bg-[#181b26] p-4">
          <p className="mb-3 text-xs font-medium tracking-wider text-gray-400 uppercase">
            Accion rapida
          </p>
          <div className="flex flex-col gap-2">
            <Button className="h-8 w-full justify-start gap-2 border border-white/10 bg-white/5 text-xs text-gray-300 hover:bg-white/10 hover:text-white">
              📋 Nueva orden
            </Button>
            <Button className="h-8 w-full justify-start gap-2 border border-white/10 bg-white/5 text-xs text-gray-300 hover:bg-white/10 hover:text-white">
              👤 Registrar cliente
            </Button>
            <Button className="h-8 w-full justify-start gap-2 border border-white/10 bg-white/5 text-xs text-gray-300 hover:bg-white/10 hover:text-white">
              🏍 Registrar moto
            </Button>
          </div>
        </Card>
        <Card className="flex-1 border-[#2a2d3a] bg-[#181b26] p-4">
          <p className="mb-3 text-xs font-medium tracking-wider text-gray-400 uppercase">
            Historial reciente
          </p>
          <div className="flex flex-col">
            {workOrders.slice(0, 5).map((order, index) => (
              <div key={order.id} className="flex gap-3 pb-3">
                <div className="flex flex-col items-center">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-orange-500" />
                  {index < 4 && (
                    <div className="mt-1 w-px flex-1 bg-[#2a2d3a]" />
                  )}
                </div>
                <div className="pb-1">
                  <p className="text-xs font-medium text-gray-200">
                    {order.licensePlate}
                  </p>
                  <p className="mt-0.5 text-[10px] text-gray-500">
                    {order.fullNameMechanic}
                  </p>
                  <Badge
                    className={`mt-1 text-[9px] ${STATUS_STYLE[order.status]}`}
                  >
                    {STATUS_LABELS[order.status]}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
