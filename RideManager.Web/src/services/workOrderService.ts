import api from "./api";
import type { WorkOrderRequest, WorkOrderResponse } from "@/types/api";

export async function getWorkOrders(): Promise<WorkOrderResponse[]> {
    const response = await api.get('/workOrders')
    return response.data
}

export async function createWorkOrder(data: WorkOrderRequest): Promise<WorkOrderResponse> {
    const response = await api.post('/workOrders', data)
    return response.data
}

export async function updateWorkOrder(id: number, data: WorkOrderRequest): Promise<void> {
    await api.put(`/workOrders/${id}`, data)
}

export async function deleteWorkOrder(id: number,): Promise<void> {
    await api.delete(`/workOrders/${id}`)
}
export async function updateWorkOrderStatus(id: number, status: string): Promise<void> {
    await api.patch(`/workOrders/${id}/status`, JSON.stringify(status), {
        headers: { 'Content-Type': 'application/json' }
    })
}