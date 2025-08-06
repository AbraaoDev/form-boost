import { api } from "../lib/axios";

export interface RegisterBody {
  name: string
  email: string
  password: string
}

export async function registerUser({ name, email, password }: RegisterBody){
  await api.post('/users', { name, email, password })
}