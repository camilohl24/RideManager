import api from "./api";
import type { NoteRequest, NotesResponse } from "@/types/api";

export async function getNotes(): Promise<NotesResponse[]> {
    const response = await api.get('/notes')
    return response.data
}

export async function createNote(data: NoteRequest): Promise<NotesResponse> {
    const response = await api.post('/notes', data)
    return response.data
}

export async function updateNote(id: number, data: NoteRequest): Promise<void> {
    await api.put(`/notes/${id}`, data)
}

export async function deleteNote(id: number): Promise<void> {
    await api.delete(`/notes/${id}`)
}