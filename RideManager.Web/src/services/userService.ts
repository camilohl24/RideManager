import type { UserRole } from "@/types/enums";
import api from "./api";
import type { RegisterDTO, UserResponse, } from "@/types/api";

export async function getUsers(): Promise<UserResponse[]> {
    const response = await api.get('/users')
    return response.data
}

export async function updateUserRole(id: number, role: UserRole): Promise<void> {
    await api.put(`/users/${id}/role`, JSON.stringify(role), {
        headers: { "Content-Type": 'application/json' }
    })
}
export async function updateUserName(id: number, username: string): Promise<void> {
    await api.put(`/users/${id}/username`, JSON.stringify(username), {
        headers: { "Content-Type": 'application/json' }
    })
}
export async function updateUserPassword(id: number, password: string): Promise<void> {
    await api.put(`/users/${id}/password`, JSON.stringify(password), {
        headers: { "Content-Type": 'application/json' }
    })
}
export async function deleteUser(id: number): Promise<void> {
    await api.delete(`/users/${id}`)
}
export async function createUser(data: RegisterDTO): Promise<void> {
    await api.post('/auth/register', data)
}