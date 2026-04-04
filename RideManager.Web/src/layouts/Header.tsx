import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
        <header className="h-[46px] bg-[#13161e] border-b border-white/5 flex items-center justify-between px-4 flex-shrink-0">

            <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-md px-3 py-1.5 w-48">
                <span className="text-gray-500 text-xs">🔍</span>
                <input
                    placeholder="Buscar..."
                    className="bg-transparent border-none outline-none text-gray-400 text-xs w-full placeholder:text-gray-600"
                />
            </div>

            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white  hover:bg-white/5">🔔</Button>
                 {user && (
                <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-lg px-2.5 py-1">
                    <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-orange-500/20 text-orange-400 text-[10px] font-bold">
                            {getInitials(user.userName)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-white text-[11px] font-medium leading-none">{user.userName}</p>
                        <p className="text-gray-500 text-[10px] leading-none mt-0.5">{user.role}</p>
                    </div>
                    <span className="text-gray-600 text-[9px] ml-1">▾</span>
                </div>

            )}
                <Button variant="ghost" size="sm" onClick={handleLogout} 
                className="text-gray-500 hover:text-white hover:bg-white/5 text-xs h-8">Salir</Button>
            </div>

        </header>
    )
}