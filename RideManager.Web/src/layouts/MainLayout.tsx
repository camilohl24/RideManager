import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'
import Header  from './Header';

export default function MainLayout() {
    return (
        <div className='flex h-scream bg[#0d0f14] overflow-hidden'>
            <Sidebar />
            <div className='flex flex-col flex-1 min-w-0'>
                <Header />
                <main className='flex-1 overflow-y-auto p-4 bg-[#0d0f14]'>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}