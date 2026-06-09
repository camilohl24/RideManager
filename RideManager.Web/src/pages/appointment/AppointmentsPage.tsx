import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { type AppointmentResponse } from '@/types/api'
import { getAppointments } from '@/services/appointmentService'

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

  const weekDays = Array.from({ length: 5 }, (_, i) => {
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

  useEffect(() => {
    async function fetchData() {
      try {
        const appointments = await getAppointments()
        setAppointments(appointments)
      } catch (error) {
        console.error('error al cargar los datos', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return <div className="flex h-full gap-4"></div>
}
