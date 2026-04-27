import { useEffect, useState } from 'react'
import {
  createWorkOrder,
  deleteWorkOrder,
  getWorkOrders,
  updateWorkOrder,
  updateWorkOrderStatus,
} from '@/services/workOrderService'
import {
  type WorkOrderResponse,
  type NotesResponse,
  type MechanicResponse,
  type MotorcycleResponse,
} from '@/types/api'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getMotorcycles } from '@/services/motorcycleService'
import { getMechanics } from '@/services/mechanicService'
import { createNote, getNotes } from '@/services/noteService'
import { WorkOrderStatus } from '@/types/enums'

export default function WorkOrdersPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrderResponse[]>([])
  const [mechanics, setMechanics] = useState<MechanicResponse[]>([])
  const [motorcycles, setMotorcycles] = useState<MotorcycleResponse[]>([])
  const [notes, setNotes] = useState<NotesResponse[]>([])
  const [newNote, setNewNote] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [selectedWorkOrder, setSelectedWorkOrder] =
    useState<WorkOrderResponse | null>(null)
  const [editWorkOrder, setEditWorkOrder] = useState<WorkOrderResponse | null>(
    null
  )
  const [workOrderToDelete, setWorkOrderToDelete] =
    useState<WorkOrderResponse | null>(null)
  const [search, setSearch] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    description: '',
    diagnosis: '',
    cost: '',
    mechanicId: '',
    motorcycleId: '',
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const mechanics = await getMechanics()
        const motorcycles = await getMotorcycles()
        const workOrders = await getWorkOrders()
        const notes = await getNotes()
        setNotes(notes)
        setWorkOrders(workOrders)
        setMotorcycles(motorcycles)
        setMechanics(mechanics)
      } catch (error) {
        console.error('error al cargar los datos', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  async function handleAddNote() {
    if (!newNote.trim() || !selectedWorkOrder) return
    try {
      await createNote({
        description: newNote,
        workOrderId: selectedWorkOrder.id,
      })
      const [updatedNotes, updatedOrders] = await Promise.all([
        getNotes(),
        getWorkOrders(),
      ])
      setNotes(updatedNotes)
      setWorkOrders(updatedOrders)
      const updated = updatedOrders.find((o) => o.id === selectedWorkOrder.id)
      if (updated) setSelectedWorkOrder(updated)
      setNewNote('')
    } catch (error) {
      console.error('Error al agregar nota', error)
    }
  }

  async function handleSubmit() {
    try {
      setError(null)
      const data = {
        ...form,
        cost: Number(form.cost),
        mechanicId: Number(form.mechanicId),
        motorcycleId: Number(form.motorcycleId),
      }
      if (editWorkOrder) {
        await updateWorkOrder(editWorkOrder.id, data)
      } else {
        await createWorkOrder(data)
      }
      const update = await getWorkOrders()
      setWorkOrders(update)
      setShowModal(false)
      setEditWorkOrder(null)
    } catch (error: any) {
      setError(error.response?.data ?? 'Error al guardar')
    }
  }

  async function handleStatusChange(newStatus: string) {
    if (!selectedWorkOrder) return
    try {
      await updateWorkOrderStatus(selectedWorkOrder.id, newStatus)
      const update = await getWorkOrders()
      setWorkOrders(update)
      setSelectedWorkOrder((prev) =>
        prev ? { ...prev, status: newStatus as WorkOrderStatus } : null
      )
    } catch (error) {
      console.error('Error al actualizar estado', error)
    }
  }
  async function handleDelete(id: number) {
    try {
      await deleteWorkOrder(id)
      const update = await getWorkOrders()
      setWorkOrders(update)
      setWorkOrderToDelete(null)
    } catch (error) {
      console.error('Error al borrar la orden', error)
    }
  }

  const pending = workOrders.filter((o) => o.status === WorkOrderStatus.Pending)
  const inRepair = workOrders.filter(
    (o) => o.status === WorkOrderStatus.InRepair
  )
  const readyForDelivery = workOrders.filter(
    (o) => o.status === WorkOrderStatus.ReadyForDelivery
  )
  const done = workOrders.filter((o) => o.status === WorkOrderStatus.Done)

  const columns = [
    { title: 'Pendiente', color: 'text-yellow-400', orders: pending },
    { title: 'En reparacion', color: 'text-red-400', orders: inRepair },
    {
      title: 'Listo para entrega',
      color: 'text-blue-400',
      orders: readyForDelivery,
    },
    { title: 'Finalizado', color: 'text-green-400', orders: done },
  ]
  const orderNotes = notes.filter((n) =>
    selectedWorkOrder?.notesId.includes(n.id)
  )

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-gray-500">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white">
            Órdenes de trabajo
          </h1>
          <p className="text-xs text-gray-500">
            {workOrders.length} órdenes registradas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex w-68 items-center gap-2 rounded-md border border-white/5 bg-white/5 px-3 py-1.5">
            <span className="text-xs text-gray-500">🔍</span>
            <input
              placeholder="Buscar por placa"
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border-none bg-transparent text-xs text-gray-400 outline-none placeholder:text-gray-600"
            />
          </div>
          <Button
            onClick={() => {
              setEditWorkOrder(null)
              setError(null)
              setForm({
                description: '',
                diagnosis: '',
                cost: '',
                mechanicId: '',
                motorcycleId: '',
              })
              setShowModal(true)
            }}
            className="bg-orange-500 font-semibold text-white hover:bg-orange-600"
          >
            + Nueva orden
          </Button>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="grid flex-1 grid-cols-4 gap-3">
          {columns.map((column) => (
            <Card
              key={column.title}
              className="border-[#2a2d3a] bg-[#181b26] p-3"
            >
              <div className="mb-3 flex items-center justify-between border-b border-[#2a2d3a] pb-2">
                <p className={`text-xs font-medium uppercase ${column.color}`}>
                  {column.title}
                </p>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-gray-500">
                  {column.orders.length}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {column.orders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => setSelectedWorkOrder(order)}
                    className="cursor-pointer rounded-md border border-[#2a2d3a] bg-[#0d0f14] p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-orange-500">
                        #{order.id}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('es-CO')}
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-medium text-white">
                      {order.licensePlate}
                    </p>
                    <p className="mt-1 line-clamp-2 text-[10px] text-gray-500">
                      {order.description}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-[8px] font-bold text-blue-400 uppercase">
                        {order.fullNameMechanic?.slice(0, 2)}
                      </div>
                      <span className="truncate text-[10px] text-gray-400">
                        {order.fullNameMechanic}
                      </span>
                      <span className="text-[10px] font-medium text-green-400">
                        ${order.cost.toLocaleString('es-CO')}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-3 border-t border-[#2a2d3a] pt-2">
                      <button
                        onClick={() => setSelectedWorkOrder(order)}
                        className="text-[10px] text-orange-500 hover:text-orange-400"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => {
                          setEditWorkOrder(order)
                          setError(null)
                          setForm({
                            description: order.description,
                            diagnosis: order.diagnosis,
                            cost: String(order.cost),
                            mechanicId: order.fullNameMechanic,
                            motorcycleId: order.licensePlate,
                          })
                          setShowModal(true)
                        }}
                        className="text-[10px] text-blue-500 hover:text-blue-400"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setWorkOrderToDelete(order)}
                        className="text-[10px] text-red-500 hover:text-red-400"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
        {selectedWorkOrder && (
          <div className="w-60 shrink-0">
            <Card className="border-[#2a2d3a] bg-[#181b26] p-4">
              <div className="mb-4 flex items-center gap-3 border-b border-[#2a2d3a] pb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-sm text-orange-400 uppercase">
                  O{selectedWorkOrder.id}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    Orden #{selectedWorkOrder.id}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedWorkOrder.licensePlate}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">Cliente</p>
                  <p className="tex-xs text-gray-300">
                    {selectedWorkOrder.ownerName}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">
                    Mecanico
                  </p>
                  <p className="tex-xs truncate text-gray-300">
                    {selectedWorkOrder.fullNameMechanic}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">Costo</p>
                  <p className="tex-xs text-green-400">
                    ${selectedWorkOrder.cost.toLocaleString('es-CO')}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">Creada</p>
                  <p className="tex-xs text-gray-300">
                    {new Date(selectedWorkOrder.createdAt).toLocaleDateString(
                      'es-CO',
                      { month: 'short', year: 'numeric' }
                    )}
                  </p>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 uppercase">Diagnóstico</p>
              <p className="text-xs text-gray-300">
                {selectedWorkOrder.diagnosis}
              </p>
              <p className="text-[10px] text-gray-500 uppercase">
                Cambiar de estado
              </p>
              <select
                value={selectedWorkOrder.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="mt-1 w-full rounded-md border border-[#2a2d3a] bg-[#0d0f14] px-3 py-2 text-xs text-gray-300 outline-none"
              >
                <option value="Pending">Pendiente</option>
                <option value="InRepair">En reparacion</option>
                <option value="ReadyForDelivery">Listo para entrega</option>
                <option value="Done">Finalizado</option>
              </select>
            </Card>
            <Card className="mt-3 overflow-visible border-[#2a2d3a] bg-[#181b26] p-4">
              <p className="mb-2 text-[10px] text-gray-500 uppercase">Notas</p>
              <div className="flex flex-col gap-2">
                {orderNotes.map((note) => (
                  <div
                    key={note.id}
                    className="rounded-md border border-[#2a2d3a] bg-[#0d0f14] px-3 py-2"
                  >
                    <p className="text-xs text-gray-300">{note.description}</p>
                    <p className="mt-1 text-[10px] text-gray-500">
                      {new Date(note.createdAt).toLocaleDateString('es-CO')}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex flex-col gap-2">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Agregar nota..."
                  rows={2}
                  className="flex-1 resize-none rounded-md border border-[#2a2d3a] bg-[#0d0f14] px-3 py-2 text-xs text-gray-300 outline-none"
                />
                <button
                  onClick={handleAddNote}
                  className="shrink-0 rounded-md bg-orange-500 px-3 py-2 text-xs font-medium text-white hover:bg-orange-600"
                >
                  + Nota
                </button>
              </div>
            </Card>
          </div>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-130 rounded-xl border border-[#2a2d3a] bg-[#181b26] p-6">
            <h2 className="mb-4 font-semibold text-white">
              {editWorkOrder ? 'Editar Motocicleta' : 'Nueva Motocicleta'}
            </h2>
            <div className="flex flex-col gap-1">
              <div className="mb-3 grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-gray-500 uppercase">
                    Descripcion
                  </label>
                  <input
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Descripcion"
                    className="rounded-md border border-[#2a2d3a] bg-[#0d0f14] px-3 py-2 text-xs text-gray-300 outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-gray-500 uppercase">
                    Diagnostico
                  </label>
                  <input
                    value={form.diagnosis}
                    onChange={(e) =>
                      setForm({ ...form, diagnosis: e.target.value })
                    }
                    placeholder="Diagnostico"
                    className="rounded-md border border-[#2a2d3a] bg-[#0d0f14] px-3 py-2 text-xs text-gray-300 outline-none"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="mb-3 grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-500 uppercase">
                      Mecanico
                    </label>
                    <select
                      value={form.mechanicId}
                      onChange={(e) =>
                        setForm({ ...form, mechanicId: e.target.value })
                      }
                      className="rounded-md border border-[#2a2d3a] bg-[#0d0f14] px-3 py-2 text-xs text-gray-300 outline-none"
                    >
                      <option value="">Seleccionar mecanico</option>
                      {mechanics.map((mechanic) => (
                        <option key={mechanic.id} value={mechanic.id}>
                          {mechanic.fullName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-500 uppercase">
                      Placa
                    </label>
                    <select
                      value={form.motorcycleId}
                      onChange={(e) =>
                        setForm({ ...form, motorcycleId: e.target.value })
                      }
                      className="rounded-md border border-[#2a2d3a] bg-[#0d0f14] px-3 py-2 text-xs text-gray-300 outline-none"
                    >
                      <option value="">Seleccionar placa</option>
                      {motorcycles.map((motorcycle) => (
                        <option key={motorcycle.id} value={motorcycle.id}>
                          {motorcycle.licensePlate}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-gray-500 uppercase">
                    Valor servicio
                  </label>
                  <input
                    value={form.cost}
                    onChange={(e) => setForm({ ...form, cost: e.target.value })}
                    placeholder="Costo"
                    className="rounded-md border border-[#2a2d3a] bg-[#0d0f14] px-3 py-2 text-xs text-gray-300 outline-none"
                  />
                </div>
              </div>
            </div>
            {error && <p className="mb-2 text-xs text-red-400">{error}</p>}
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:bg-white/10 hover:text-white"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-orange-500 text-white hover:bg-orange-600"
              >
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}
      {workOrderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-95 rounded-xl border border-[#2a2d3a] bg-[#181b26] p-6">
            <h2 className="mb-2 text-sm font-semibold text-white">
              Eliminar Orden de trabajo?
            </h2>
            <p className="mb-6 text-xs text-gray-500">
              Esta accion eliminara permanente a la orden de trabajo{' '}
              <span className="font-medium text-white">
                #{workOrderToDelete.id}
              </span>
              . No se puede deshacer.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setWorkOrderToDelete(null)}
                className="text-gray-400 hover:bg-white/10 hover:text-white"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => handleDelete(workOrderToDelete.id)}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
