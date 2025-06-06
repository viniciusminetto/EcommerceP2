import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dummyjson.com', // ou sua API real
  timeout: 10000,
});

export default api;