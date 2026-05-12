import type { LoginRequest, LoginResponse } from "../types/api";

/**
 * Simulates user login for local/demo development.
 *
 * The role is selected from the username so the frontend can test
 * role-based dashboards without requiring a live authentication service.
 */
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
