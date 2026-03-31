import axios from 'axios'
import type {LoginRequest, TokenResponse }from '../types/auth'

const API_URL = 'https://localhost:7000/api'

export async function login(data: LoginRequest): Promise<TokenResponse>{
  const response = await  axios.post(`${API_URL}/auth/login`, data)
  return response.data
}




