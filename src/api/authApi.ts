import axios from 'axios';
import { LoginRequest, LoginResponse } from '../types';

const BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export const loginRequest = async (
  credentials: LoginRequest,
): Promise<LoginResponse> => {
  const { data } = await axios.post<LoginResponse>(
    `${BASE}/auth/login`,
    credentials,
    { headers: { 'Content-Type': 'application/json' } },
  );
  return data;
};