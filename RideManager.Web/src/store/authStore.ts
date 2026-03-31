import {create} from 'zustand'
import type { AuthUser }from '../types/auth'

interface AuthState{
    token : string | null
    user : AuthUser| null
    setAuth: (token: string, User: AuthUser) => void
    logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    user: null,
    setAuth:(token,user) => set({token, user}),
    logout:()=> set({token: null, user: null})
}));