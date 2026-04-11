import api from './api'
import type { MotorcycleResponse } from '@/types/api'

export async function getMotorcycles(): Promise<MotorcycleResponse[]> {
    const response = await api.get('/motorcycles')
    return response.data
}
