import { useEffect, useState } from 'react'
import { type MechanicResponse } from '@/types/api'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  getMechanics,
  createMechanic,
  updateMechanic,
  deleteMechanic,
} from '@/services/mechanicService'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function MechanicsPage() {
  const [mechanics, setMechanics] = useState<MechanicResponse[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [selectedMechanic, setSelectedMechanic] =
    useState<MechanicResponse | null>(null)
  const [editMechanic, setEdiMechanic] = useState<MechanicResponse | null>(null)
  const [mechanicToDelete, setMechanicToDelete] =
    useState<MechanicResponse | null>(null)
  const [search, setSearch] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    documentId: '',
    phone: '',
    email: '',
    position: '',
  })

  const filterdMechanics = mechanics.filter(
    (m) =>
      m.fullName.toLowerCase().includes(search.toLowerCase()) ||
      m.documentId.includes(search)
  )

  useEffect(() => {
    async function fetchData() {
      try {
        const mechanics = await getMechanics()
        setMechanics(mechanics)
      } catch (error) {
        console.error('Error al cargar los datos', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-gray-500">Cargando...</p>
      </div>
    )
  }

  async function handleSubmit() {
    try {
      setError(null)
      if (editMechanic) {
        await updateMechanic(editMechanic.id, form)
      } else {
        await createMechanic(form)
      }
      const update = await getMechanics()
      setMechanics(update)
      setShowModal(false)
      setEdiMechanic(null)
    } catch (error: any) {
      setError(error.response?.data ?? 'Error al guardar')
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteMechanic(id)
      const update = await getMechanics()
      setMechanics(update)
      setMechanicToDelete(null)
    } catch (error) {
      console.error('Error al borrar el usuario', error)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white">Mecanicos</h1>
          <p className="text-xs text-gray-500">
            {mechanics.length} Mecanicos registrados
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex w-68 items-center gap-2 rounded-md border border-white/5 bg-white/5 px-3 py-1.5">
            <span className="text-xs text-gray-500">🔍</span>
            <input
              placeholder="Buscar por nombre o documento..."
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border-none bg-transparent text-xs text-gray-400 outline-none placeholder:text-gray-600"
            />
          </div>
          <Button
            onClick={() => {
              setEdiMechanic(null)
              setError(null)
              setForm({
                firstName: '',
                lastName: '',
                documentId: '',
                phone: '',
                email: '',
                position: '',
              })
              setShowModal(true)
            }}
            className="bg-orange-500 font-semibold text-white hover:bg-orange-600"
          >
            + Nuevo mecanico
          </Button>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="min-w-0 flex-1">
          <Card className="border-[#2a2d3a] bg-[#181b26]">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-white/5">
                  <TableHead className="text-gray-400 uppercase">
                    Nombre
                  </TableHead>
                  <TableHead className="text-gray-400 uppercase">
                    Cargo
                  </TableHead>
                  <TableHead className="text-gray-400 uppercase">
                    Email
                  </TableHead>
                  <TableHead className="text-gray-400 uppercase">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterdMechanics.map((mechanic) => (
                  <TableRow
                    key={mechanic.id}
                    className="border-[#2a2d3a] hover:bg-white/5"
                  >
                    <TableCell className="text-gray-300">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-[10px] font-bold text-orange-400 uppercase">
                          {mechanic.fullName.slice(0, 2)}
                        </div>
                        {mechanic.fullName}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {mechanic.position}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {mechanic.email}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setSelectedMechanic(mechanic)}
                          className="text-xs text-orange-500 hover:text-orange-400"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => {
                            setEdiMechanic(mechanic)
                            setError(null)
                            setForm({
                              firstName: mechanic.fullName.split(' ')[0],
                              lastName: mechanic.fullName
                                .split(' ')
                                .slice(1)
                                .join(' '),
                              documentId: mechanic.documentId,
                              phone: mechanic.phone,
                              email: mechanic.email,
                              position: mechanic.position,
                            })
                            setShowModal(true)
                          }}
                          className="text-xs text-blue-500 hover:text-blue-400"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => setMechanicToDelete(mechanic)}
                          className="text-xs text-red-500 hover:text-red-400"
                        >
                          Eliminar
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
        {selectedMechanic && (
          <div className="w-60 shrink-0">
            <Card className="border-[#2a3d3a] bg-[#181b26] p-4">
              <div className="mb-4 flex items-center gap-3 border-b border-[#2a2d3a] pb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-sm text-orange-400 uppercase">
                  {selectedMechanic.fullName.slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {selectedMechanic.fullName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedMechanic.position}
                  </p>
                </div>
              </div>
              <div className="mb-3 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">
                    Documento
                  </p>
                  <p className="tex-xs text-gray-300">
                    {selectedMechanic.documentId}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">Email</p>
                  <p className="tex-xs truncate text-gray-300">
                    {selectedMechanic.email}
                  </p>
                </div>
              </div>
              <div className="mb-3 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">Desde</p>
                  <p className="tex-xs text-gray-300">
                    {new Date(selectedMechanic.createdAt).toLocaleDateString(
                      'es-CO',
                      { month: 'short', year: 'numeric' }
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">
                    Telefono
                  </p>
                  <p className="tex-xs text-gray-300">
                    {selectedMechanic.phone}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-130 rounded-xl border border-[#2a2d3a] bg-[#181b26] p-6">
            <h2 className="mb-4 text-sm font-semibold text-white">
              {editMechanic ? 'Editar mecanico' : 'Nuevo mecanico'}
            </h2>
            <div className="flex flex-col gap-1">
              <div className="mb-3 grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-500 uppercase">
                    Nombre
                  </label>
                  <input
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                    placeholder="Nombre"
                    className="rounded-md border border-[#2a2d3a] bg-[#0d0f14] px-3 py-2 text-xs text-gray-300 outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-500 uppercase">
                    Apellido
                  </label>
                  <input
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                    placeholder="Apellido"
                    className="rounded-md border border-[#2a2d3a] bg-[#0d0f14] px-3 py-2 text-xs text-gray-300 outline-none"
                  />
                </div>
              </div>
              <div className="mb-3 grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-500 uppercase">
                    Documento
                  </label>
                  <input
                    value={form.documentId}
                    onChange={(e) =>
                      setForm({ ...form, documentId: e.target.value })
                    }
                    placeholder="Documento"
                    className="rounded-md border border-[#2a2d3a] bg-[#0d0f14] px-3 py-2 text-xs text-gray-300 outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-500 uppercase">
                    Cargo
                  </label>
                  <input
                    value={form.position}
                    onChange={(e) =>
                      setForm({ ...form, position: e.target.value })
                    }
                    placeholder="Cargo"
                    className="rounded-md border border-[#2a2d3a] bg-[#0d0f14] px-3 py-2 text-xs text-gray-300 outline-none"
                  />
                </div>
              </div>

              <div className="mb-3 grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-500 uppercase">
                    Telefono
                  </label>
                  <input
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="Telefono"
                    className="rounded-md border border-[#2a2d3a] bg-[#0d0f14] px-3 py-2 text-xs text-gray-300 outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-500 uppercase">
                    Email
                  </label>
                  <input
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="Email"
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

      {mechanicToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-95 rounded-xl border border-[#2a2d3a] bg-[#181b26] p-6">
            <h2 className="mb-2 text-sm font-semibold text-white">
              Eliminar Mecanico?
            </h2>
            <p className="mb-6 text-xs text-gray-500">
              Esta accion eliminara permanente a{' '}
              <span className="font-medium text-white">
                {mechanicToDelete.fullName}
              </span>
              . No se puede deshacer.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setMechanicToDelete(null)}
                className="text-gray-400 hover:bg-white/10 hover:text-white"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => handleDelete(mechanicToDelete.id)}
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
