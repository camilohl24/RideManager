import { useEffect, useState } from 'react'
import {
  createOwner,
  deleteOwner,
  getOwners,
  updateOwner,
} from '@/services/ownerService'
import { type OwnerResponse } from '@/types/api'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function OwnersPage() {
  const [owners, setOwners] = useState<OwnerResponse[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [selectedOwner, setSelectedOwner] = useState<OwnerResponse | null>(null)
  const [editOwner, setEditOwner] = useState<OwnerResponse | null>(null)
  const [ownerTODelete, setOwnerToDelete] = useState<OwnerResponse | null>(null)
  const [search, setSearch] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    documentId: '',
    phone: '',
    email: '',
  })

  const filterdOwners = owners.filter(
    (o) =>
      o.fullName.toLowerCase().includes(search.toLowerCase()) ||
      o.documentId.includes(search)
  )
  useEffect(() => {
    async function fetchData() {
      try {
        const owners = await getOwners()
        setOwners(owners)
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
        <p className="text-sm text-gray-500">Cargando</p>
      </div>
    )
  }

  async function handleSubmit() {
    try {
      setError(null)
      if (editOwner) {
        await updateOwner(editOwner.id, form)
      } else {
        await createOwner(form)
      }
      const update = await getOwners()
      setOwners(update)
      setShowModal(false)
      setEditOwner(null)
    } catch (error: any) {
      setError(error.Response?.data ?? 'Error al guardar')
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteOwner(id)
      const update = await getOwners()
      setOwners(update)
      setOwnerToDelete(null)
    } catch (error) {
      console.error('Error al borrar el usuario', error)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white">Clientes</h1>
          <p className="text-xs text-gray-500">
            {owners.length} clientes registrados
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
              setEditOwner(null)
              setError(null)
              setForm({
                firstName: '',
                lastName: '',
                documentId: '',
                phone: '',
                email: '',
              })
              setShowModal(true)
            }}
            className="bg-orange-500 font-semibold text-white hover:bg-orange-600"
          >
            + Nuevo cliente
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
                    cliente
                  </TableHead>
                  <TableHead className="text-gray-400 uppercase">
                    documento
                  </TableHead>
                  <TableHead className="text-gray-400 uppercase">
                    teléfono
                  </TableHead>
                  <TableHead className="text-gray-400 uppercase">
                    email
                  </TableHead>
                  <TableHead className="text-gray-400 uppercase">
                    motos
                  </TableHead>
                  <TableHead className="text-gray-400 uppercase">
                    acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterdOwners.map((owner) => (
                  <TableRow
                    key={owner.id}
                    className="border-[#2a2d3a] hover:bg-white/5"
                  >
                    <TableCell className="text-gray-300">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-[10px] font-bold text-orange-400 uppercase">
                          {owner.fullName.slice(0, 2)}
                        </div>
                        {owner.fullName}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {owner.documentId}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {owner.phone}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {owner.email}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <Badge className="bg-green-500/15 text-green-400 hover:bg-green-500/15">
                        {owner.motorcycles?.length ?? 0} motos
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setSelectedOwner(owner)}
                          className="text-xs text-orange-500 hover:text-orange-400"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => {
                            setEditOwner(owner)
                            setError(null)
                            setForm({
                              firstName: owner.fullName.split(' ')[0],
                              lastName: owner.fullName
                                .split(' ')
                                .slice(1)
                                .join(' '),
                              documentId: owner.documentId,
                              phone: owner.phone,
                              email: owner.email,
                            })
                            setShowModal(true)
                          }}
                          className="text-xs text-blue-500 hover:text-blue-400"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => setOwnerToDelete(owner)}
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
        {selectedOwner && (
          <div className="w-60 shrink-0">
            <Card className="border-[#2a3d3a] bg-[#181b26] p-4">
              <div className="mb-4 flex items-center gap-3 border-b border-[#2a2d3a] pb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-sm text-orange-400 uppercase">
                  {selectedOwner.fullName.slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {selectedOwner.fullName}
                  </p>
                  <p className="text-xs text-gray-500">
                    CC {selectedOwner.documentId}
                  </p>
                </div>
              </div>
              <div className="mb-3 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">
                    Telefono
                  </p>
                  <p className="tex-xs text-gray-300">{selectedOwner.phone}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">Email</p>
                  <p className="tex-xs truncate text-gray-300">
                    {selectedOwner.email}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">
                    Cliente desde
                  </p>
                  <p className="tex-xs text-gray-300">
                    {new Date(selectedOwner.createdAt).toLocaleDateString(
                      'es-CO',
                      { month: 'short', year: 'numeric' }
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">
                    Total motos
                  </p>
                  <p className="text-xs text-gray-300">
                    {selectedOwner.motorcycles?.length ?? 0}
                  </p>
                </div>
              </div>

              <p className="mb-2 text-[10px] text-gray-500 uppercase">
                Motocicletas
              </p>
              <div className="flex flex-col gap-2">
                {selectedOwner.motorcycles?.map((moto) => (
                  <div
                    key={moto.licensePlate}
                    className="rounded-md border border-[#2a2d3a] bg-[#0d0f14] px-3 py-2"
                  >
                    <p className="text-xs font-medium text-orange-400">
                      {moto.licensePlate}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {moto.brand} {moto.reference} · {moto.model}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-130 rounded-xl border border-[#2a2d3a] bg-[#181b26] p-6">
            <h2 className="mb-4 text-sm font-semibold text-white">
              {editOwner ? 'Editar cliente' : 'Nuevo cliente'}
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
      {ownerTODelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-95 rounded-xl border border-[#2a2d3a] bg-[#181b26] p-6">
            <h2 className="mb-2 text-sm font-semibold text-white">
              Eliminar cliente?
            </h2>
            <p className="mb-6 text-xs text-gray-500">
              Esta accion eliminara permanente a{' '}
              <span className="font-medium text-white">
                {ownerTODelete.fullName}
              </span>
              . No se puede deshacer.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setOwnerToDelete(null)}
                className="text-gray-400 hover:bg-white/10 hover:text-white"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => handleDelete(ownerTODelete.id)}
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
