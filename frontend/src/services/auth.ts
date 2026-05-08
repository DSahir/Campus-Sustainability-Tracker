//import axios from "axios";
//import type { LoginRequest, LoginResponse } from "../types/api";
//const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

//export const authApi = axios.create({
//  baseURL: API_BASE_URL,
//  headers: {
//    "Content-Type": "application/json"
//  }
//});

//export async function loginUser(payload: LoginRequest): Promise<LoginResponse> {
//  const response = await authApi.post<LoginResponse>("/auth/login", payload);
//  return response.data;
//}
import type { LoginRequest, LoginResponse } from "../types/api";

export async function loginUser(payload: LoginRequest): Promise<LoginResponse> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  let role: LoginResponse["role"] = "student";

  if (payload.username === "admin") {
    role = "admin";
  } else if (payload.username === "manager") {
    role = "facility_manager";
  }

  return {
    access_token: "fake-jwt-token",
    token_type: "bearer",
    role
  };
}