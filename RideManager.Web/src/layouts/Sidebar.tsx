import { NavLink } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Separator } from "@/components/ui/separator";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const NAV_MAIN = [
    { label: 'Dashboard', path: '/dashboard', icon: '⊞' },
    { label: 'Clientes', path: '/owners', icon: '👥' },
    { label: 'Motocicletas', path: '/motorcycles', icon: '🏍' },
    { label: 'Ordenes de trabajo', path: '/workOrders', icon: '🔧' },
    { label: 'Citas', path: '/appointments', icon: '📅' },
    { label: 'Mecánicos', path: '/mechanics', icon: '🧰' }
]
/* const NAV_SECONDARY =[
    {label: 'Inventario',          path: '/inventory',     icon: '📦'},
    {label: 'Reportes',            path: '/reports',       icon: '📊'}
] */

const NAV_USER = [
    { label: 'Usuarios', path: '/users', icon: '👤', roles: ['Admin'] },
]

const NAV_BOTTON = [
    { label: 'Configuración', path: '/settings', icon: '⚙️' }
]

interface NavItemProps {
    label: string,
    path: string,
    icon: string
    roles?: string[]
}

function NavItem({ label, path, icon }: NavItemProps) {
    return (
        <TooltipProvider delayDuration={200}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <NavLink
                        to={path}
                        className={({ isActive }) =>
                            `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors
                                ${isActive
                                ? 'bg-orange-500/13 text-orange-400 font-medium'
                                : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
                            }`
                        }
                    >
                        <span className="text-sm w-4 text-center">
                            {icon}
                        </span>
                        {label}
                    </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">
                    {label}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
export default function Sidebar() {
    const user = useAuthStore((s) => s.user)
    return (
        <aside className="w-[185px] h-screen bg-[#13161e] border-r border-white/5 flex flex-col flex-shrink-0">

            <div className="h-[46px] flex items-center px-4 border-b border-white/5 flex-shrink-0">
                <span className="text-sm font-extrabold text-white tracking-wider">
                    RIDE<span className="text-orange-500">MANAGER</span>
                </span>
            </div>

            <nav className="flex flex-col gap-0.5 px-2 pt-3">
                {NAV_MAIN.map((item) => (
                    <NavItem key={item.path} {...item} />
                ))}
            </nav>

            <Separator className="mx-3 my-2 bg-white/5 w-auto" />

            <nav className="flex flex-col gap-0.5 px-2">
                {NAV_USER.filter(item =>
                    !item.roles || (user && item.roles.includes(user.role))
                ).map((item) => (
                    <NavItem key={item.path} {...item} />
                ))}
            </nav>

            <Separator className="mx-3 my-2 bg-white/5 w-auto" />

            <nav className="flex flex-col gap-0.5 px-2 ">
                {NAV_BOTTON.map((item) => (
                    <NavItem key={item.path} {...item} />
                ))}
            </nav>

            {user && (
                <div className="mt-auto px-3 py-3 border-t border-white/5 ">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 text-[10px] font-bold uppercase flex-shrink-0">
                            {user?.userName.slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                            <p className="text-white text-xs font-medium truncate">{user.userName}</p>
                            <p className="text-gray-500 text-[10px] ">{user.role}</p>
                        </div>
                    </div>
                </div>
            )}

        </aside>

    )
}
