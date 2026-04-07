import api from "./api";
import type { MechanicResponse } from "@/types/api";

export async function getMechanics(): Promise<MechanicResponse[]> {
    const response = await api.get('/mechanics')
    return response.data
}