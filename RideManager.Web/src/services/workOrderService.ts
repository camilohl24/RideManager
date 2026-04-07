import api from "./api";
import type { WorkOrderResponse } from "@/types/api";

export async function getWorkOrders(): Promise<WorkOrderResponse[]> {
    const response = await api.get('/workOrders')
    return response.data
}