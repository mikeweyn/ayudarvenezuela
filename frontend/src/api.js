import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
});

export const buscarPersonas = (q) => api.get(`/api/personas/search?q=${encodeURIComponent(q)}`);
export const obtenerPersona = (id) => api.get(`/api/personas/${id}`);
export const registrarPersona = (data) => api.post('/api/personas', data);
export const agregarAviso = (data) => api.post('/api/avisos', data);
export const listarRecientes = () => api.get('/api/personas');
