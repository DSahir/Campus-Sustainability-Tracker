import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import DashboardPage from "../pages/DashboardPage";
import { AuthProvider } from "../context/AuthContext";
import { mockDashboardData } from "../__mocks__/mockData";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";

vi.mock("../services/dashboard", () => ({
  getDashboardData: vi.fn(async () => mockDashboardData)
}));

function Wrapper() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/dashboard/:role" element={<DashboardPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

describe("DashboardPage", () => {
  it("charts mount without crash", async () => {
    window.history.pushState({}, "", "/dashboard/admin");
    render(<Wrapper />);

    await waitFor(() => {
      expect(screen.getByText(/7-day resource trends/i)).toBeInTheDocument();
      expect(screen.getByText(/building comparison/i)).toBeInTheDocument();
      expect(screen.getByText(/waste breakdown/i)).toBeInTheDocument();
    });
  });
});