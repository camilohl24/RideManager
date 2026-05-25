import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { type AppointmentResponse } from '@/types/api'
import { getAppointments } from '@/services/appointmentService'

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [search, setSearch] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)

  const today = new Date() // what date is today
  const weekDay = today.getDay() // day of today
  const monday = new Date(today) // create a copy today
  monday.setDate(today.getDate() - weekDay + 1) // look for monday

  const weekDays = Array.from({ length: 5 }, (_, i) => {
    const day = new Date(monday)
    day.setDate(monday.getDate() + i)

    return day.toLocaleDateString('es-CO', {
      weekday: 'long',
    })
  }) // show days of week

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
}
