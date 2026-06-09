import api from "./api";
import type { AppointmentRequest, AppointmentResponse } from "@/types/api";

export async function getAppointments(): Promise<AppointmentResponse[]> {
    const response = await api.get('/appointments')
    return response.data
}

export async function createAppointment(data: AppointmentRequest): Promise<AppointmentResponse> {
    const response = await api.post('/appointments', data)
    return response.data
}

export async function updateAppointment(id: number, data: AppointmentRequest): Promise<void> {
    await api.put(`/appointments/${id}`, data)
}

export async function deleteAppointment(id: number,): Promise<void> {
    await api.delete(`/appointments/${id}`)
}

export async function updateAppointmentStatus(id: number, status: string): Promise<void> {
    await api.patch(`/appointments/${id}/status`, JSON.stringify(status), {
        headers: { 'Content-Type': 'application/json' }
    })
}