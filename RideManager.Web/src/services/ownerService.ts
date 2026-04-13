import api from "./api";
import type { OwnerResponse, OwnerRequest } from "@/types/api";

export async function getOwners(): Promise<OwnerResponse[]> {
    const response = await api.get('/owners')
    return response.data
}

export async function createOwner(data: OwnerRequest): Promise<OwnerResponse> {
    const response = await api.post('/owners', data)
    return response.data
}

export async function updateOwner(id: number, data: OwnerRequest): Promise<void> {
    await api.put(`/owners/${id}`, data)
}
export async function deleteOwner(id: number,): Promise<void> {
    await api.delete(`/owners/${id}`)
}