import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { login } from '@/services/authService'
import { useAuthStore } from '@/store/authStore'
import { jwtDecode } from 'jwt-decode'

export default function LoginPage() {
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const setAuth = useAuthStore((state) => state.setAuth)
    const navigate = useNavigate()
    async function handleLogin() {
        try {
            setError('')
            const response = await login({ userName, password })
            const user = jwtDecode<{
                sub: number
                unique_name: string
                'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string
            }>(response.token)

            setAuth(response.token, {
                id: Number(user.sub),
                userName: user.unique_name,
                role: user[
                    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
                ],
            })
            navigate('/dashboard')
        } catch {
            setError('Usuario o contraseña incorrectos')
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-950">
            <Card className="w-full max-w-md border-gray-800 bg-gray-900">
                <CardHeader>
                    <CardTitle className="text-center text-2xl text-white">
                        RideManager
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <Input
                        placeholder="Usuario"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <Input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <p className="text-center text-sm text-red-400">{error}</p>}
                    <Button onClick={handleLogin} className="w-full">
                        Iniciar Sesión
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
