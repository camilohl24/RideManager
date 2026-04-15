import { useEffect, useState } from 'react'
import { getOwners } from '@/services/ownerService'
import { getMotorcycles } from '@/services/motorcycleService'
import { type MotorcycleResponse, type OwnerResponse } from '@/types/api'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function MotorcyclesPage() {
  const [owners, setOwners] = useState<OwnerResponse[]>([])
  const [motorcycles, setMotorcycles] = useState<MotorcycleResponse[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [search, setSearch] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)
  const [editMotorcyle, setEditMotorcycle] =
    useState<MotorcycleResponse | null>(null)
  const [motorcycleToDelete, setMotorcycleToDelete] =
    useState<MotorcycleResponse | null>(null)
  const [selectedMotorcyle, setSelectedMotorcyle] =
    useState<MotorcycleResponse | null>(null)
  const [form, setForm] = useState({
    brand: '',
    licensePlate: '',
    model: '',
    ownerId: '',
    reference: '',
  })

  const filterdMotorcycles = motorcycles.filter((m) =>
    m.licensePlate.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    async function fetchData() {
      try {
        const motorcycles = await getMotorcycles()
        const owners = await getOwners()
        setOwners(owners)
        setMotorcycles(motorcycles)
      } catch (error) {
        console.error('error al cargar los datos', error)
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white">Motocicletas</h1>
          <p className="text-xs text-gray-500">
            {motorcycles.length} motos registradas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex w-68 items-center gap-2 rounded-md border border-white/5 bg-white/5 px-3 py-1.5">
            <span className="text-xs text-gray-500">🔍</span>
            <input
              placeholder="Buscar por placa..."
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border-none bg-transparent text-xs text-gray-400 outline-none placeholder:text-gray-600"
            />
          </div>
          <Button
            onClick={() => {
              setEditMotorcycle(null)
              setError(null)
              setForm({
                brand: '',
                licensePlate: '',
                model: '',
                ownerId: '',
                reference: '',
              })
              setShowModal(true)
            }}
            className="bg-orange-500 font-semibold text-white hover:bg-orange-600"
          >
            + Nueva moto
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
                    placa
                  </TableHead>
                  <TableHead className="text-gray-400 uppercase">
                    marca/referencia
                  </TableHead>
                  <TableHead className="text-gray-400 uppercase">
                    modelo
                  </TableHead>
                  <TableHead className="text-gray-400 uppercase">
                    propietario
                  </TableHead>
                  <TableHead className="text-gray-400 uppercase">
                    ordenes
                  </TableHead>
                  <TableHead className="text-gray-400 uppercase">
                    acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterdMotorcycles.map((motorcycle) => (
                  <TableRow
                    key={motorcycle.id}
                    className="border-[#2a2d3a] hover:bg-white/5"
                  >
                    <TableCell className="text-orange-500">
                      {motorcycle.licensePlate}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {motorcycle.brand} {motorcycle.reference}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {motorcycle.model}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-[10px] font-bold text-orange-400 uppercase">
                          {motorcycle.ownerName.slice(0, 2)}
                        </div>
                        {motorcycle.ownerName}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <Badge className="bg-green-500/15 text-green-400 hover:bg-green-500/15">
                        {motorcycle.workOrdersId?.length ?? 0} ordenes
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setSelectedMotorcyle(motorcycle)}
                          className="text-xs text-orange-500 hover:text-orange-400"
                        >
                          Ver
                        </button>
                        <button className="text-xs text-blue-500 hover:text-blue-400">
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
        {selectedMotorcyle && (
          <div className="w-60 shrink-0">
            <Card className="border-[#2a2d3a] bg-[#181b26] p-4">
              <div className="mb-4 flex items-center gap-3 border-b border-[#2a2d3a] pb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-sm text-orange-400 uppercase">
                  {selectedMotorcyle.licensePlate.slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {selectedMotorcyle.licensePlate}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedMotorcyle.brand} {selectedMotorcyle.reference}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">Marca</p>
                  <p className="tex-xs text-gray-300">
                    {selectedMotorcyle.brand}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">
                    Referencia
                  </p>
                  <p className="tex-xs truncate text-gray-300">
                    {selectedMotorcyle.reference}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">Modelo</p>
                  <p className="tex-xs truncate text-gray-300">
                    {selectedMotorcyle.model}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">
                    Registrada desde
                  </p>
                  <p className="tex-xs truncate text-gray-300">
                    {new Date(selectedMotorcyle.createdAt).toLocaleDateString(
                      'es-CO',
                      { month: 'short', year: 'numeric' }
                    )}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
