import { NavLink } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Separator } from '@/components/ui/separator'

const NAV_MAIN = [
  { label: 'Dashboard', path: '/dashboard', icon: '⊞' },
  { label: 'Clientes', path: '/owners', icon: '👥' },
  { label: 'Motocicletas', path: '/motorcycles', icon: '🏍' },
  { label: 'Ordenes de trabajo', path: '/workOrders', icon: '🔧' },
  { label: 'Citas', path: '/appointments', icon: '📅' },
  { label: 'Mecánicos', path: '/mechanics', icon: '🧰' },
]
/* const NAV_SECONDARY =[
    {label: 'Inventario',          path: '/inventory',     icon: '📦'},
    {label: 'Reportes',            path: '/reports',       icon: '📊'}
] */

const NAV_USER = [
  { label: 'Usuarios', path: '/users', icon: '👤', roles: ['Admin'] },
]

const NAV_BOTTON = [{ label: 'Configuración', path: '/settings', icon: '⚙️' }]

interface NavItemProps {
  label: string
  path: string
  icon: string
  roles?: string[]
}

function NavItem({ label, path, icon }: NavItemProps) {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition-colors ${
          isActive
            ? 'bg-orange-500/10 font-medium text-orange-400'
            : 'text-gray-500 hover:bg-white/5 hover:text-gray-200'
        }`
      }
    >
      <span className="w-4 text-center text-sm">{icon}</span>
      {label}
    </NavLink>
  )
}
export default function Sidebar() {
  const user = useAuthStore((s) => s.user)
  return (
    <aside className="flex h-screen w-[185px] flex-shrink-0 flex-col border-r border-white/5 bg-[#13161e]">
      <div className="flex h-[46px] flex-shrink-0 items-center border-b border-white/5 px-4">
        <span className="text-sm font-extrabold tracking-wider text-white">
          RIDE<span className="text-orange-500">MANAGER</span>
        </span>
      </div>

      <nav className="flex flex-col gap-0.5 px-2 pt-3">
        {NAV_MAIN.map((item) => (
          <NavItem key={item.path} {...item} />
        ))}
      </nav>

      <Separator className="mx-3 my-2 w-auto bg-white/5" />

      <nav className="flex flex-col gap-0.5 px-2">
        {NAV_USER.filter(
          (item) => !item.roles || (user && item.roles.includes(user.role))
        ).map((item) => (
          <NavItem key={item.path} {...item} />
        ))}
      </nav>

      <Separator className="mx-3 my-2 w-auto bg-white/5" />

      <nav className="flex flex-col gap-0.5 px-2">
        {NAV_BOTTON.map((item) => (
          <NavItem key={item.path} {...item} />
        ))}
      </nav>

      {user && (
        <div className="mt-auto border-t border-white/5 px-3 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-[10px] font-bold text-orange-400 uppercase">
              {user?.userName.slice(0, 2)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-white">
                {user.userName}
              </p>
              <p className="text-[10px] text-gray-500">{user.role}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
