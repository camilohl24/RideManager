import type {
    WorkOrderStatus,
    AppointmentStatus,
    AppointmentType,
} from './enums'

export interface WorkOrderResponse {
    completedAt: string | null
    cost: number
    createdAt: string
    description: string
    diagnosis: string
    fullNameMechanic: string
    id: number
    licensePlate: string
    notesId: number[]
    status: WorkOrderStatus
    ownerName: string | null
}

export interface MechanicResponse {
    documentId: string
    email: string
    fullName: string
    id: number
    phone: string
    position: string
    createdAt: string
}

export interface MotorcycleResponse {
    brand: string
    id: number
    licensePlate: string
    model: number
    ownerId: number
    ownerName: string
    reference: string
    workOrdersId: number[] | null
    createdAt: string
}

export interface OwnerMotorcycleResponse {
    licensePlate: string
    model: number
    reference: string
    brand: string
}
export interface OwnerResponse {
    documentId: string
    email: string
    fullName: string
    id: number
    phone: string
    createdAt: string
    motorcycles: OwnerMotorcycleResponse[] | null
}

export interface AppointmentResponse {
    contactName: string | null
    contactPhone: string | null
    createdAt: string
    fullNameMechanic: string | null
    fullNameOwner: string | null
    id: number
    licensePlate: string | null
    reason: string
    scheduledAt: string | null
    status: AppointmentStatus
    turnNumber: number
    type: AppointmentType
}

export interface NotesResponse {
    createdAt: string
    description: string
    id: number
    workOrderId: number
}

export interface TokenResponse {
    token: string
}

export interface OwnerRequest {
    documentId: string
    email: string
    firstName: string
    lastName: string
    phone: string
}

export interface MotorcycleRequest {
    brand: string
    licensePlate: string
    model: number
    ownerId: number
    reference: string
}