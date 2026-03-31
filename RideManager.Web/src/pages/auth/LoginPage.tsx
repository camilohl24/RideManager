import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card,CardContent,CardHeader,CardTitle } from "@/components/ui/card";

export default function LoginPage(){
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    return(
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
                    onChange={(e)=> setUserName(e.target.value)}
                    />
                    <Input 
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e)=> setPassword(e.target.value)}
                    />
                    <Button className="w-full">Iniciar Sesión</Button>
                </CardContent>
            </Card>
        </div>
    )
}

