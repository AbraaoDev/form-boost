import { api } from "../lib/axios";

export interface LoginBody {
  email: string
  password: string
}

export async function login({email, password }: LoginBody){
  await api.post('/sessions', { email, password })
}