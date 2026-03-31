export interface LoginRequest{
    userName: string
    password: string
}

export interface TokenResponse{
    token: string
}

export interface AuthUser{
    id : number
    userName : string
    role : string
}