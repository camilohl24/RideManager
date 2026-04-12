import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function Header() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function getInitials(name: string) {
    return name.slice(0, 2).toLocaleUpperCase()
  }

  return (
    <header className="flex h-11.5 shrink-0 items-center justify-between border-b border-white/5 bg-[#13161e] px-4">
      <div className="flex w-48 items-center gap-2 rounded-md border border-white/5 bg-white/5 px-3 py-1.5">
        <span className="text-xs text-gray-500">🔍</span>
        <input
          placeholder="Buscar..."
          className="w-full border-none bg-transparent text-xs text-gray-400 outline-none placeholder:text-gray-600"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:bg-white/5 hover:text-white"
        >
          🔔
        </Button>
        {user && (
          <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-2.5 py-1">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-orange-500/20 text-[10px] font-bold text-orange-400">
                {getInitials(user.userName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-[11px] leading-none font-medium text-white">
                {user.userName}
              </p>
              <p className="mt-0.5 text-[10px] leading-none text-gray-500">
                {user.role}
              </p>
            </div>
            <span className="ml-1 text-[9px] text-gray-600">▾</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="h-8 text-xs text-gray-500 hover:bg-white/5 hover:text-white"
        >
          Salir
        </Button>
      </div>
    </header>
  )
}
