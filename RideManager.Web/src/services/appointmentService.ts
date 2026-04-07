import api from "./api";
import type { AppointmentResponse } from "@/types/api";

export async function getAppointments(): Promise<AppointmentResponse[]> {
    const response = await api.get('/appointments')
    return response.data
}