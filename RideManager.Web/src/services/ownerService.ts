import api from "./api";
import type { OwnerResponse } from "@/types/api";

export async function getOwners(): Promise<OwnerResponse[]> {
    const response = await api.get('/owners')
    return response.data
}