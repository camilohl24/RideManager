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
import { UserRole } from '@/types/enums'

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

  const filterdUsers = users.filter(
    (u) =>
      u.userName.toLowerCase().includes(search.toLowerCase()) ||
      u.role.includes(search)
  )
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

  async function handleSubmit() {
    if (!editUser) return
    try {
      setError(null)
      if (activeModal === 'username') {
        await updateUserName(editUser.id, newUserName)
      } else if (activeModal === 'password') {
        await updateUserPassword(editUser.id, newPassword)
      } else if (activeModal === 'role') {
        await updateUserRole(editUser.id, newRole as UserRole)
      }

      const update = await getUsers()
      setUsers(update)
      setActiveModal(null)
      setEditUser(null)
    } catch (error: any) {
      setError(error.response?.data ?? 'Error al guardar')
    }
  }

  async function handleCreate() {
    try {
      setError(null)
      await createUser({
        ...form,
        role: form.role as UserRole,
      })
      const update = await getUsers()
      setUsers(update)
      setShowCreateModal(false)
      setForm({ userName: '', password: '', role: '' })
    } catch (error: any) {
      setError(error.response?.data ?? 'Error al guardar')
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteUser(id)
      const update = await getUsers()
      setUsers(update)
      setUserToDelete(null)
    } catch (error) {
      console.error('Error al borrar el usuario', error)
    }
  }

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
          <h1 className="text-lg font-semibold text-white">Usuarios</h1>
          <p className="text-xs text-gray-500">
            {users.length} usuarios registrados.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex w-68 items-center gap-2 rounded-md border border-white/5 bg-white/5 px-3 py-1.5">
            <span className="text-xs text-gray-500">🔍</span>
            <input
              placeholder="Buscar por nombre o rol..."
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border-none bg-transparent text-xs text-gray-400 outline-none placeholder:text-gray-600"
            />
          </div>
          <Button
            onClick={() => {
              setError(null)
              setForm({
                userName: '',
                password: '',
                role: '',
              })
              setShowCreateModal(true)
            }}
            className="rounded-md bg-orange-500 font-semibold text-white hover:bg-orange-600"
          >
            + Nuevo usuario
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
                    usuario
                  </TableHead>
                  <TableHead className="text-gray-400 uppercase">rol</TableHead>
                  <TableHead className="text-gray-400 uppercase">
                    acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterdUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="border-[#2a2d3a] hover:bg-white/5"
                  >
                    <TableCell className="text-gray-300">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-[10px] font-bold text-orange-400 uppercase">
                          {user.userName.slice(0, 2)}
                        </div>
                        {user.userName}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">{user.role}</TableCell>

                    <TableCell className="text-gray-300">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setEditUser(user)
                            setError(null)
                          }}
                          className="text-xs text-blue-500 hover:text-blue-400"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => setUserToDelete(user)}
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
      </div>
      {editUser && (
        <div className="w-60 shrink-0">
          <Card className="border-[#2a2d3a] bg-[#181b26] p-4">
            <div className="mb-4 flex items-center gap-3 border-b border-[#2a2d3a] pb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-sm text-orange-400 uppercase">
                {editUser.userName.slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {editUser.userName}
                </p>
                <p className="text-xs text-gray-500">{editUser.role}</p>
              </div>
              <button
                onClick={() => setEditUser(null)}
                className="ml-auto w-5 rounded-sm border border-[#2a2d3a] bg-red-400/5 text-xs text-white hover:bg-red-500"
              >
                x
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setNewUserName(editUser.userName)
                  setActiveModal('username')
                }}
                className="w-full rounded-md border border-[#2a2d3a] bg-[#0d0f14] px-3 py-2 text-left text-xs text-blue-400 hover:bg-white/5"
              >
                @ Cambiar usuario
              </button>
              <button
                onClick={() => {
                  setNewRole(editUser.role)
                  setActiveModal('role')
                }}
                className="w-full rounded-md border border-[#2a2d3a] bg-[#0d0f14] px-3 py-2 text-left text-xs text-orange-400 hover:bg-white/5"
              >
                ★ Cambiar rol
              </button>
              <button
                onClick={() => setActiveModal('password')}
                className="w-full rounded-md border border-[#2a2d3a] bg-[#0d0f14] px-3 py-2 text-left text-xs text-red-400 hover:bg-white/5"
              >
                🔒 Cambiar contraseña
              </button>
            </div>
          </Card>
        </div>
      )}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-130 rounded-xl border border-[#2a2d3a] bg-[#181b26] p-6">
            <h2 className="mb-4 text-sm font-semibold text-white">
              Nuevo usuario
            </h2>
            <div className="flex flex-col gap-1">
              <div className="mb-3 grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-500 uppercase">
                    Nombre de Usuario
                  </label>
                  <input
                    value={form.userName}
                    onChange={(e) =>
                      setForm({ ...form, userName: e.target.value })
                    }
                    placeholder="Nombre de usuario"
                    className="rounded-md border border-[#2a2d3a] bg-[#0d0f14] px-3 py-2 text-xs text-gray-300 outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-500 uppercase">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    placeholder="Contraseña"
                    className="rounded-md border border-[#2a2d3a] bg-[#0d0f14] px-3 py-2 text-xs text-gray-300 outline-none"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="rounded-md border border-[#2a2d3a] bg-[#0d0f14] px-3 py-2 text-xs text-gray-300 outline-none"
                >
                  <option value="">Seleccionar rol</option>
                  <option value={UserRole.Admin}>Administrador</option>
                  <option value={UserRole.Mechanic}>Mecanico</option>
                  <option value={UserRole.Receptionist}>Recepcionista</option>
                </select>
              </div>
            </div>
            {error && <p className="mb-2 text-xs text-red-400">{error}</p>}
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:bg-white/10 hover:text-white"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreate}
                className="bg-orange-500 text-white hover:bg-orange-600"
              >
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-95 rounded-xl border border-[#2a2d3a] bg-[#181b26] p-6">
            <h2 className="mb-2 text-sm font-semibold text-white">
              Eliminar usuario?
            </h2>
            <p className="mb-6 text-xs text-gray-500">
              Esta accion eliminara permanente a{' '}
              <span className="font-medium text-white">
                {userToDelete.userName}
              </span>
              . No se puede deshacer.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setUserToDelete(null)}
                className="text-gray-400 hover:bg-white/10 hover:text-white"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => handleDelete(userToDelete.id)}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-130 rounded-xl border border-[#2a2d3a] bg-[#181b26] p-6">
            <h2 className="mb-4 text-sm font-semibold text-white">
              {activeModal === 'username' && 'Cambiar usuario'}
              {activeModal === 'password' && 'Cambiar contraseña'}
              {activeModal === 'role' && 'Cambiar rol'}
            </h2>
            {activeModal === 'username' && (
              <input
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="Nuevo usuario"
                className="w-full rounded-md border border-[#2a2d3a] bg-[#0d0f14] px-3 py-2 text-xs text-gray-300 outline-none"
              />
            )}
            {activeModal === 'role' && (
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full rounded-md border border-[#2a2d3a] bg-[#0d0f14] px-3 py-2 text-xs text-gray-300 outline-none"
              >
                <option value="">Seleccione Rol</option>
                <option value="Admin">Admistrador</option>
                <option value="Mechanic">Mecanico</option>
                <option value="Recepcionist">Recepcionista</option>
              </select>
            )}
            {activeModal === 'password' && (
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nueva contraseña"
                className="w-full rounded-md border border-[#2a2d3a] bg-[#0d0f14] px-3 py-2 text-xs text-gray-300 outline-none"
              />
            )}
            {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:bg-white/10 hover:text-white"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-orange-500 text-white hover:bg-orange-700"
              >
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
