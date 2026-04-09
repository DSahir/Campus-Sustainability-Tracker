/**
 * Dashboard.test.tsx
 * Tests: loading state, KPI cards, charts mount, alert feed, role labels, stub fallback.
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

import DashboardPage   from '../pages/DashboardPage';
import { AuthProvider } from '../context/AuthContext';
import * as dashApi     from '../api/dashboardApi';
import { STUB_METRICS, STUB_BUILDINGS, STUB_ALERTS } from '../data/stubs';

// ── Stub ResponsiveContainer to avoid ResizeObserver errors in jsdom ──────────
vi.mock('recharts', async () => {
  const real = await vi.importActual<typeof import('recharts')>('recharts');
  return {
    ...real,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="recharts-container" style={{ width: 800, height: 400 }}>
        {children}
      </div>
    ),
  };
});

// ── Helpers ───────────────────────────────────────────────────────────────────
const renderDashboard = (role = 'admin') =>
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={[`/dashboard/${role}`]}>
        <Routes>
          <Route path="/dashboard/:role" element={<DashboardPage />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );

const resolvedStubs = () =>
  vi.spyOn(dashApi, 'fetchDashboardData').mockResolvedValue([
    STUB_METRICS,
    STUB_BUILDINGS,
    STUB_ALERTS,
  ]);

// ── Suite ─────────────────────────────────────────────────────────────────────
describe('DashboardPage', () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.restoreAllMocks());

  // ── Loading state ─────────────────────────────────────────────────────────
  it('shows a loading spinner while data is in-flight', () => {
    vi.spyOn(dashApi, 'fetchDashboardData').mockReturnValue(new Promise(() => {}));
    renderDashboard();
    expect(screen.getByText(/loading dashboard/i)).toBeInTheDocument();
  });

  // ── Three parallel API calls ──────────────────────────────────────────────
  it('calls fetchDashboardData exactly once on mount', async () => {
    const spy = resolvedStubs();
    renderDashboard();
    await waitFor(() => expect(spy).toHaveBeenCalledTimes(1));
  });

  // ── KPI Cards ─────────────────────────────────────────────────────────────
  it('renders all three KPI card titles', async () => {
    resolvedStubs();
    renderDashboard();
    await waitFor(() =>
      expect(screen.getByText(/energy consumption/i)).toBeInTheDocument(),
    );
    expect(screen.getByText(/water usage/i)).toBeInTheDocument();
    expect(screen.getByText(/co₂ emissions/i)).toBeInTheDocument();
  });

  it('displays the stub energy value in the KPI card', async () => {
    resolvedStubs();
    renderDashboard();
    // 124,520 formatted with toLocaleString
    await waitFor(() =>
      expect(screen.getByText(/124[,.]?520/)).toBeInTheDocument(),
    );
  });

  // ── Charts mount ─────────────────────────────────────────────────────────
  it('renders chart section headings', async () => {
    resolvedStubs();
    renderDashboard();
    await waitFor(() =>
      expect(screen.getByText(/7-day resource trends/i)).toBeInTheDocument(),
    );
    expect(screen.getByText(/per-building comparison/i)).toBeInTheDocument();
    expect(screen.getByText(/waste breakdown/i)).toBeInTheDocument();
  });

  it('mounts multiple ResponsiveContainer wrappers (one per chart)', async () => {
    resolvedStubs();
    renderDashboard();
    await waitFor(() =>
      expect(screen.getAllByTestId('recharts-container').length).toBeGreaterThanOrEqual(3),
    );
  });

  // ── Alerts feed ───────────────────────────────────────────────────────────
  it('renders the alerts feed heading', async () => {
    resolvedStubs();
    renderDashboard();
    await waitFor(() =>
      expect(screen.getByText(/active alerts/i)).toBeInTheDocument(),
    );
  });

  it('shows the correct active alert count from stubs (4)', async () => {
    resolvedStubs();
    renderDashboard();
    await waitFor(() =>
      expect(screen.getByText(/4 active/i)).toBeInTheDocument(),
    );
  });

  it('renders individual alert building names', async () => {
    resolvedStubs();
    renderDashboard();
    await waitFor(() =>
      expect(screen.getByText('Lederle')).toBeInTheDocument(),
    );
    expect(screen.getByText('Morrill')).toBeInTheDocument();
  });

  // ── Role labels ───────────────────────────────────────────────────────────
  it('shows "Admin" label in navbar for admin role', async () => {
    resolvedStubs();
    renderDashboard('admin');
    await waitFor(() =>
      expect(screen.getByText('Admin')).toBeInTheDocument(),
    );
  });

  it('shows "Facility Manager" label for facility_manager role', async () => {
    resolvedStubs();
    renderDashboard('facility_manager');
    await waitFor(() =>
      expect(screen.getByText('Facility Manager')).toBeInTheDocument(),
    );
  });

  it('shows "Student" label for student role', async () => {
    resolvedStubs();
    renderDashboard('student');
    await waitFor(() =>
      expect(screen.getByText('Student')).toBeInTheDocument(),
    );
  });

  // ── Page header ───────────────────────────────────────────────────────────
  it('renders the page title and campus subtitle', async () => {
    resolvedStubs();
    renderDashboard();
    await waitFor(() =>
      expect(screen.getByText(/sustainability dashboard/i)).toBeInTheDocument(),
    );
    expect(screen.getByText(/umass amherst/i)).toBeInTheDocument();
  });

  // ── Stub fallback ─────────────────────────────────────────────────────────
  it('falls back to stub data and shows the dev banner when the API fails', async () => {
    vi.spyOn(dashApi, 'fetchDashboardData').mockRejectedValue(new Error('503'));
    renderDashboard();
    await waitFor(() =>
      expect(screen.getByText(/stub data/i)).toBeInTheDocument(),
    );
    // KPI cards should still render from stubs
    expect(screen.getByText(/energy consumption/i)).toBeInTheDocument();
  });
});