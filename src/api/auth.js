import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function login(correo, password) {
  return axios.post(`${API_URL}/auth/login`, {
    correo,
    password,
  });
}

