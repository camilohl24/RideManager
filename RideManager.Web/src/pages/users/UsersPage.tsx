import { useEffect, useState } from 'react'
import type { UserResponse, RegisterDTO } from '@/types/api'
import {
  createUser,
  updateUserName,
  updateUserPassword,
  updateUserRole,
  deleteUser,
  getUsers,
} from '@/services/userService'
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
import { Card } from '@/components/ui/card'

export default function UsersPage() {
  const [users, setUsers] = useState<UserResponse[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState<string>('')
  const [activeModal, setActiveModal] = useState<
    'username' | 'password' | 'role' | null
  >(null)
  const [editUser, setEditUser] = useState<UserResponse | null>(null)
  const [userToDelete, setUserToDelete] = useState<UserResponse | null>(null)
  const [form, setForm] = useState({
    userName: '',
    password: '',
    role: '',
  })
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false)
  const [newUserName, setNewUserName] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')
  const [newRole, setNewRole] = useState<string>('')

  useEffect(() => {
    async function fetchData() {
      try {
        const users = await getUsers()
        setUsers(users)
      } catch (error) {
        console.error('Error al cargar los datos', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])
}
