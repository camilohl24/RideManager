import api from "./api";
import type { MechanicRequest, MechanicResponse } from "@/types/api";

export async function getMechanics(): Promise<MechanicResponse[]> {
    const response = await api.get('/mechanics')
    return response.data
}
export async function createMechanic(data: MechanicRequest): Promise<MechanicResponse> {
    const response = await api.post('/mechanics', data)
    return response.data
}

export async function updateMechanic(id: number, data: MechanicRequest): Promise<void> {
    await api.put(`/mechanics/${id}`, data)
}

export async function deleteMechanic(id: number): Promise<void> {
    await api.delete(`/mechanics/${id}`)
}