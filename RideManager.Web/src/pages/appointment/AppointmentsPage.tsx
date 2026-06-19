import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  type MechanicResponse,
  type AppointmentRequest,
  type AppointmentResponse,
} from '@/types/api'
import {
  createAppointment,
  deleteAppointment,
  getAppointments,
  updateAppointment,
  updateAppointmentStatus,
} from '@/services/appointmentService'
import { AppointmentType, type AppointmentStatus } from '@/types/enums'
import { getMechanics } from '@/services/mechanicService'

const getMonday = (date: Date): Date => {
  const monday = new Date(date)
  monday.setDate(date.getDate() - date.getDay() + 1)
  return monday
}
export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([])
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    getMonday(new Date())
  )
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [mechanics, setMechanics] = useState<MechanicResponse[]>([])
  const [appointmentToDelete, setAppointmentToDelete] =
    useState<AppointmentResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [editAppointment, setEditAppointmnet] =
    useState<AppointmentResponse | null>(null)
  const [form, setForm] = useState<AppointmentRequest>({
    contactName: '',
    contactPhone: '',
    mechanicId: 0,
    motorcycleId: 0,
    ownerId: 0,
    reason: '',
    type: AppointmentType.Scheduled,
    scheduledAt: '',
  })

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(currentWeekStart)
    day.setDate(currentWeekStart.getDate() + i)
    return day
  })
  const goToPreviousWeek = () => {
    const prev = new Date(currentWeekStart)
    prev.setDate(prev.getDate() - 7)
    setCurrentWeekStart(prev)
  }

  const goToNextWeek = () => {
    const next = new Date(currentWeekStart)
    next.setDate(next.getDate() + 7)
    setCurrentWeekStart(next)
  }

  const weekAppointments = appointments.filter((a) => {
    if (!a.scheduledAt || a.type !== 'Scheduled') return false
    const aptDate = new Date(a.scheduledAt)
    const wekEnd = new Date(currentWeekStart)
    wekEnd.setDate(currentWeekStart.getDate() + 6)
    return aptDate >= currentWeekStart && aptDate <= wekEnd
  })

  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter(
      (a) =>
        a.scheduledAt &&
        new Date(a.scheduledAt).toDateString() === day.toDateString() &&
        a.type === 'Scheduled'
    )
  }

  const todayWalkins = appointments.filter(
    (a) =>
      a.type === 'Walkin' &&
      new Date(a.createdAt).toDateString() === new Date().toDateString()
  )

  async function handleDelete(id: number) {
    try {
      await deleteAppointment(id)
      const update = await getAppointments()
      setAppointments(update)
      setAppointmentToDelete(null)
      setSelectedAppointment(null)
    } catch (error) {
      console.error('Error al borrar la cita', error)
    }
  }
  async function handleSubmit() {
    try {
      setError(null)
      const dataToSend = {
        ...form,
        scheduledAt:
          form.type === 'Walkin' ? undefined : form.scheduledAt || undefined,
        ownerId: form.ownerId || null,
        motorcycleId: form.motorcycleId || null,
      }
      if (editAppointment) {
        await updateAppointment(editAppointment.id, dataToSend)
      } else {
        await createAppointment(dataToSend)
      }

      const update = await getAppointments()
      console.log('appointments actualizados:', update)
      setAppointments(update)
      setShowModal(false)
      setEditAppointmnet(null)
    } catch (error: any) {
      setError(error.response?.data ?? 'Error al guargar')
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const appointments = await getAppointments()
        const mechanics = await getMechanics()
        setAppointments(appointments)
        setMechanics(mechanics)
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
    <div className="flex h-full gap-4">
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-medium text-white">Citas</h2>
            <p className="text-muted-foreground text-sm">
              {weekAppointments.length} citas esta semana
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
              ← Anterior
            </Button>
            <Button variant="outline" size="sm">
              {currentWeekStart.toLocaleDateString('es-CO', {
                month: 'long',
                year: 'numeric',
              })}
            </Button>
            <Button variant="outline" size="sm" onClick={goToNextWeek}>
              Siguiente →
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setEditAppointmnet(null)
                setError(null)
                setForm({
                  contactName: '',
                  contactPhone: '',
                  mechanicId: 0,
                  motorcycleId: 0,
                  ownerId: 0,
                  reason: '',
                  type: AppointmentType.Scheduled,
                  scheduledAt: '',
                })
                setShowModal(true)
              }}
            >
              + Nueva cita
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, i) => {
            const isToday = day.toDateString() === new Date().toDateString()
            const dayAppointments = getAppointmentsForDay(day)
            return (
              <div key={i} className="flex flex-col gap-2">
                <div
                  className={`rounded-lg border p-2 text-center ${isToday ? 'border-orange-500 bg-orange-950/30' : 'border-border bg-card'}`}
                >
                  <p
                    className={`text-xs font-medium uppercase ${isToday ? 'text-orange-400' : 'text-muted-foreground'}`}
                  >
                    {day.toLocaleDateString('es-CO', { weekday: 'short' })}
                  </p>
                  <p
                    className={`text-xl font-medium ${isToday ? 'text-orange-400' : ''}`}
                  >
                    {day.getDate()}
                  </p>
                </div>
                {dayAppointments.length === 0 ? (
                  <div className="border-border text-muted-foreground rounded-lg border border-dashed p-4 text-center text-xs">
                    Sin citas
                  </div>
                ) : (
                  dayAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      onClick={() => {
                        setSelectedAppointment(apt)
                        setSelectedStatus(apt.status)
                      }}
                      className={`hover:border-border/80 cursor-pointer rounded-lg border p-2 transition-colors ${selectedAppointment?.id === apt.id ? 'border-orange-500' : 'border-border bg-card'}`}
                    >
                      <p className="text-xs font-medium text-orange-400">
                        {apt.scheduledAt
                          ? new Date(apt.scheduledAt).toLocaleTimeString(
                              'es-CO',
                              { hour: '2-digit', minute: '2-digit' }
                            )
                          : ''}
                      </p>
                      <p className="text-xs font-medium">
                        {apt.fullNameOwner ?? apt.contactName}
                      </p>
                      <span
                        className={`mt-1 inline-block rounded px-1.5 py-0.5 text-xs ${
                          apt.status === 'Pending'
                            ? 'bg-yellow-950 text-yellow-500'
                            : apt.status === 'Confirmed'
                              ? 'bg-blue-950 text-blue-500'
                              : apt.status === 'Completed'
                                ? 'bg-green-950 text-green-500'
                                : 'bg-red-950 text-red-400'
                        }`}
                      >
                        {apt.status === 'Pending'
                          ? 'Pendiente'
                          : apt.status === 'Confirmed'
                            ? 'Confirmada'
                            : apt.status === 'Completed'
                              ? 'Completada'
                              : 'Cancelada'}
                      </span>
                      <p className="text-muted-foreground text-xs">
                        {apt.licensePlate}
                      </p>
                      <p className="text-muted-foreground truncate text-xs">
                        {apt.reason}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )
          })}
        </div>
        <div className="border-border rounded-lg border p-3">
          <div className="mb-3 flex items-center gap-2">
            <p className="text-sm font-medium text-white">
              Walk-in hoy — turnos del día
            </p>
            <span className="rounded bg-orange-950 px-2 py-0.5 text-xs text-orange-400">
              {todayWalkins.length} en espera
            </span>
          </div>

          {todayWalkins.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center text-xs">
              Sin walk-ins hoy
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {todayWalkins.map((apt) => (
                <div
                  key={apt.id}
                  onClick={() => {
                    setSelectedAppointment(apt)
                    setSelectedStatus(apt.status)
                  }}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${selectedAppointment?.id === apt.id ? 'border-orange-500' : 'border-border bg-card'}`}
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-orange-500 bg-orange-950 text-xs font-medium text-orange-400">
                    {apt.turnNumber}
                  </div>
                  <div>
                    <p className="text-xs font-medium">
                      {apt.fullNameOwner ?? apt.contactName}
                    </p>
                    <span
                      className={`mt-1 inline-block rounded px-1.5 py-0.5 text-xs ${
                        apt.status === 'Pending'
                          ? 'bg-yellow-950 text-yellow-500'
                          : apt.status === 'Confirmed'
                            ? 'bg-blue-950 text-blue-500'
                            : apt.status === 'Completed'
                              ? 'bg-green-950 text-green-500'
                              : 'bg-red-950 text-red-400'
                      }`}
                    >
                      {apt.status === 'Pending'
                        ? 'Pendiente'
                        : apt.status === 'Confirmed'
                          ? 'Confirmada'
                          : apt.status === 'Completed'
                            ? 'Completada'
                            : 'Cancelada'}
                    </span>
                    <p className="text-muted-foreground text-xs">
                      {apt.licensePlate} · {apt.fullNameMechanic}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {selectedAppointment && (
        <div className="border-border flex w-72 shrink-0 flex-col gap-4 self-start rounded-lg border p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground mb-1 text-xs tracking-wide uppercase">
                {selectedAppointment.type === 'Walkin'
                  ? `Walk-in · Turno ${selectedAppointment.turnNumber}`
                  : 'Cita agendada'}
              </p>
              <p className="text-base font-medium text-white">
                {selectedAppointment.fullNameOwner ??
                  selectedAppointment.contactName}
              </p>
            </div>
            <button
              onClick={() => setSelectedAppointment(null)}
              className="text-muted-foreground border-border rounded border p-1 text-xs"
            >
              X
            </button>
          </div>

          <div className="bg-border h-px" />

          <div className="flex flex-col gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mecanico</span>
              <span className="font-medium text-white">
                {selectedAppointment.fullNameMechanic ?? '-'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Telefono</span>
              <span className="font-medium text-white">
                {selectedAppointment.contactPhone ?? '-'}
              </span>
            </div>
            <div className="bg-card border-border text-muted-foreground rounded border p-2">
              {selectedAppointment.reason}
            </div>
          </div>

          <div className="bg-border h-px" />

          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Cambiar estado
            </p>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border-border bg-card w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="Pending">Pendiente</option>
              <option value="Confirmed">Confirmada</option>
              <option value="Cancelled">Cancelada</option>
              <option value="Completed">Completada</option>
            </select>
            <Button
              onClick={async () => {
                if (!selectedAppointment) return
                await updateAppointmentStatus(
                  selectedAppointment.id,
                  selectedStatus
                )
                setAppointments(
                  appointments.map((a) =>
                    a.id === selectedAppointment.id
                      ? { ...a, status: selectedStatus as AppointmentStatus }
                      : a
                  )
                )
                setSelectedAppointment({
                  ...selectedAppointment,
                  status: selectedStatus as AppointmentStatus,
                })
              }}
              size="sm"
              className="w-full"
            >
              Guardar estado
            </Button>
          </div>

          <div className="bg-border h-px" />

          <div className="flex flex-col gap-2">
            <Button
              onClick={() => {
                setEditAppointmnet(selectedAppointment)
                setError(null)
                setForm({
                  contactName: selectedAppointment.contactName,
                  contactPhone: selectedAppointment.contactPhone,
                  mechanicId: selectedAppointment.mechanicId,
                  motorcycleId: selectedAppointment.motorcycleId,
                  ownerId: selectedAppointment.ownerId,
                  reason: selectedAppointment.reason,
                  type: selectedAppointment.type,
                  scheduledAt: selectedAppointment.scheduledAt ?? undefined,
                })
                setShowModal(true)
              }}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Editar cita
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={() => setAppointmentToDelete(selectedAppointment)}
            >
              Eliminar cita
            </Button>
          </div>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-130 rounded-xl border border-[#2a2d3a] bg-[#181b26] p-6">
            <h2 className="mb-4 font-semibold text-white">
              {editAppointment ? 'Editar cita' : 'Nueva cita'}
            </h2>
            <div className="flex flex-col gap-1">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-gray-500 uppercase">
                  Tipo de cita
                </label>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      type: e.target.value as AppointmentType,
                    })
                  }
                  className="rounded-md border border-[#2a2d3a] bg-[#0d0f14] px-3 py-2 text-xs text-gray-300 outline-none"
                >
                  <option value="">Selecionar tipo de cita</option>
                  <option value="Scheduled">Programada</option>
                  <option value="Walkin">Sin cita previa</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-gray-500 uppercase">
                  Mecanico
                </label>
                <select
                  value={form.mechanicId ?? ''}
                  onChange={(e) =>
                    setForm({ ...form, mechanicId: Number(e.target.value) })
                  }
                  className="rounded-md border border-[#2a2d3a] bg-[#0d0f14] px-3 py-2 text-xs text-gray-300 outline-none"
                >
                  <option value="">Seleccionar mecánico</option>
                  {mechanics.map((mechanic) => (
                    <option key={mechanic.id} value={mechanic.id}>
                      {mechanic.fullName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-gray-500 uppercase">
                  Razón
                </label>
                <textarea
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  className="rounded-md border border-[#2a2d3a] bg-[#0d0f14] px-3 py-2 text-xs text-gray-300 outline-none"
                  rows={3}
                />
              </div>
              {form.type === 'Scheduled' && (
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-gray-500 uppercase">
                    Fecha y hora
                  </label>
                  <input
                    type="datetime-local"
                    value={form.scheduledAt ?? ''}
                    onChange={(e) =>
                      setForm({ ...form, scheduledAt: e.target.value })
                    }
                    className="rounded-md border border-[#2a2d3a] bg-[#0d0f14] px-3 py-2 text-xs text-gray-300 outline-none"
                  />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-gray-500 uppercase">
                  Nombre de contacto
                </label>
                <input
                  type="text"
                  value={form.contactName ?? ''}
                  onChange={(e) =>
                    setForm({ ...form, contactName: e.target.value })
                  }
                  className="rounded-md border border-[#2a2d3a] bg-[#0d0f14] px-3 py-2 text-xs text-gray-300 outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-gray-500 uppercase">
                  Telefóno contacto
                </label>
                <input
                  type="text"
                  value={form.contactPhone ?? ''}
                  onChange={(e) =>
                    setForm({ ...form, contactPhone: e.target.value })
                  }
                  className="rounded-md border border-[#2a2d3a] bg-[#0d0f14] px-3 py-2 text-xs text-gray-300 outline-none"
                />
              </div>
              {error && <p className="mb-2 text-xs text-red-400">{error}</p>}
              <div className="mt-4 justify-end gap-3">
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
        </div>
      )}
      {appointmentToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60">
          <div className="w-95 rounded-xl border border-[#2a2d3a] bg-[#181b26] p-6">
            <h2 className="mb-2 text-sm font-semibold text-white">
              Eliminar cita?
            </h2>
            <p className="p-6 text-xs text-gray-500">
              Esta accionj elimiara permanente la cita de (' ')
              <span className="font-medium text-white">
                {appointmentToDelete.contactName}
              </span>
              . Nose puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setAppointmentToDelete(null)}
                className="text-gray-400 hover:bg-white/10 hover:text-white"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => handleDelete(appointmentToDelete.id)}
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
