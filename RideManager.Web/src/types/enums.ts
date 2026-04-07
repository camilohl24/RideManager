export const WorkOrderStatus = {
    Pending : 'Pending',
    InRepair : 'InRepair',
    Done : 'Done',
    ReadyForDelivery : 'ReadyForDelivery'
}as const

export type WorkOrderStatus = typeof WorkOrderStatus[keyof typeof WorkOrderStatus]

export const AppointmentStatus = {
Pending: 'Pending',
Confirmed: 'Confirmed',
Cancelled: 'Cancelled',
Completed: 'Completed'
}as const

export type AppointmentStatus = typeof AppointmentStatus[keyof typeof AppointmentStatus]

export const AppointmentType = {
    Sheduled: 'Sheduled',
    Walkin: 'Walkin'
}as const

export type AppointmentType = typeof AppointmentType[keyof typeof AppointmentType]

