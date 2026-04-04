import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { login } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();
    async function handleLogin() {
        try {
            setError('');
            const response = await login({ userName, password });
            const user = jwtDecode<{ id: number, unique_name: string, role: string }>(response.token);
            setAuth(response.token, {
                id: user.id,
                userName: user.unique_name,
                role: user.role
            });
            navigate('/dashboard')
        } catch {
            setError('Usuario o contraseña incorrectos')
        }
    }

    return (
        <div className="fixed inset-0 bg-gray-950 flex items-center justify-center">
            <Card className="w-full max-w-md bg-gray-900 border-gray-800">
                <CardHeader>
                    <CardTitle className="text-white text-2xl text-center">
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
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    <Button onClick={handleLogin} className="w-full">Iniciar Sesión</Button>
                </CardContent>
            </Card>
        </div>
    )
}

