import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import LoginPage from "../pages/LoginPage";
import { AuthProvider } from "../context/AuthContext";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";

vi.mock("../services/auth", () => ({
  loginUser: vi.fn(async () => ({
    access_token: "fake-token",
    token_type: "bearer",
    role: "admin"
  }))
}));

describe("LoginPage", () => {
  it("renders login form", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("submit fires successfully", async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    await user.clear(screen.getByLabelText(/username/i));
    await user.type(screen.getByLabelText(/username/i), "admin");
    await user.clear(screen.getByLabelText(/password/i));
    await user.type(screen.getByLabelText(/password/i), "password");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByRole("button")).toHaveTextContent(/signing in|sign in/i);
    });
  });
});