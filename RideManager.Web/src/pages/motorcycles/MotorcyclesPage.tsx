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

export default function Motorcyclespage() {
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
}
