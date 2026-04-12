import { useEffect, useState } from 'react'
import { getOwners } from '@/services/ownerService'
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
              className="w-full border-none bg-transparent text-xs text-gray-400 outline-none placeholder:text-gray-600"
            />
          </div>
          <Button
            onClick={() => setShowModal(true)}
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
                <TableRow>
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
                {owners.map((owner) => (
                  <TableRow key={owner.id} className="border-[#2a2d3a]">
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
                        {owner.licensePlates?.length ?? 0} motos
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
                            setShowModal(true)
                          }}
                          className="text-xs text-blue-500 hover:text-blue-400"
                        >
                          Editar
                        </button>
                        <button className="text-xs text-red-500 hover:text-red-400">
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
                    {selectedOwner.licensePlates?.length ?? 0}
                  </p>
                </div>
              </div>

              <p className="mb-2 text-[10px] text-gray-500 uppercase">
                Motocicletas
              </p>
              <div className="flex flex-col gap-2">
                {selectedOwner.licensePlates?.map((plate) => (
                  <div
                    key={plate}
                    className="rounded-md border border-[#2a2d3a] bg-[#0d0f14] px-3 py-2"
                  >
                    <p className="text-xs font-medium text-orange-400">
                      {plate}
                    </p>
                    <p className="mt-0.5 text-[10px] text-gray-500 lowercase">
                      {selectedOwner.brand} {selectedOwner.reference} ·
                      {selectedOwner.model}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
