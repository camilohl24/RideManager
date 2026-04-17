import api from './api'
import type { MotorcycleRequest, MotorcycleResponse } from '@/types/api'

export async function getMotorcycles(): Promise<MotorcycleResponse[]> {
    const response = await api.get('/motorcycles')
    return response.data
}
export async function createMotorcycle(data: MotorcycleRequest): Promise<MotorcycleResponse> {
    const response = await api.post('/motorcycles', data)
    return response.data
}

export async function updateMotorcycle(id: number, data: MotorcycleRequest): Promise<void> {
    await api.put(`/motorcycles/${id}`, data)
}

export async function deleteMotorcycle(id: number): Promise<void> {
    await api.delete(`/motorcycles/${id}`)
}