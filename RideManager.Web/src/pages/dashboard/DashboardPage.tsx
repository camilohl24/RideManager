import { getAppointments } from '@/services/appointmentService';
import { getWorkOrders } from '@/services/workOrderService';
import { getOwners } from '@/services/ownerService';
import { getMechanics } from '@/services/mechanicService';
import { useEffect, useState } from 'react';
import { type MechanicResponse, type AppointmentResponse, type OwnerResponse, type WorkOrderResponse } from '@/types/api';
import { WorkOrderStatus } from '@/types/enums';

export default function DashboardPage() {
    const [workOrders, setWorkOrders] = useState<WorkOrderResponse[]>([]);
    const [owners, setOwners] = useState<OwnerResponse[]>([]);
    const [mechanics, setMechanics] = useState<MechanicResponse[]>([]);
    const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchData() {

            try {
                const workOrders = await getWorkOrders()
                const appointments = await getAppointments()
                const owners = await getOwners()
                const mechanics = await getMechanics()
                setWorkOrders(workOrders)
                setAppointments(appointments)
                setOwners(owners)
                setMechanics(mechanics)
            } catch (error) {
                console.error('Error al cargar datos:', error)
            } finally {
                setLoading(false)
            }

        }
        fetchData()


    }, [])
    const activeOrders = workOrders.filter(o => 
        o.status !== WorkOrderStatus.Done &&
        o.status !== WorkOrderStatus.ReadyForDelivery
    ).length

}


