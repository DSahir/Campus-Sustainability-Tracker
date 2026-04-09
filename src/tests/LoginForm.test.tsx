/**
 * LoginForm.test.tsx
 * Tests: render, field gating, submit fires API, role-based redirect, 401 error, generic error.
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

import LoginPage       from '../pages/LoginPage';
import { AuthProvider } from '../context/AuthContext';
import * as authApi     from '../api/authApi';
import * as axiosMem    from '../api/axiosInstance';

// ── Mock react-router navigate ────────────────────────────────────────────────
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const real = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...real, useNavigate: () => mockNavigate };
});

// ── Helpers ───────────────────────────────────────────────────────────────────
const renderLogin = () =>
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/login']}>
        <LoginPage />
      </MemoryRouter>
    </AuthProvider>,
  );

/** Builds a fake AxiosError-shaped object (axios.isAxiosError checks .isAxiosError flag). */
const makeAxiosError = (status: number) =>
  Object.assign(new Error(`Request failed with status code ${status}`), {
    isAxiosError: true,
    response: { status, data: { detail: 'error' } },
  });

// ── Suite ─────────────────────────────────────────────────────────────────────
describe('LoginPage', () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.restoreAllMocks());

  // ── Render ────────────────────────────────────────────────────────────────
  it('renders username field, password field, and submit button', () => {
    renderLogin();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('does not show an error banner on first render', () => {
    renderLogin();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  // ── Field gating ──────────────────────────────────────────────────────────
  it('submit button is disabled when both fields are empty', () => {
    renderLogin();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDisabled();
  });

  it('submit button is disabled when only username is filled', async () => {
    const user = userEvent.setup();
    renderLogin();
    await user.type(screen.getByLabelText(/username/i), 'admin');
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDisabled();
  });

  it('submit button is enabled when both fields have content', async () => {
    const user = userEvent.setup();
    renderLogin();
    await user.type(screen.getByLabelText(/username/i), 'admin');
    await user.type(screen.getByLabelText(/password/i), 'secret');
    expect(screen.getByRole('button', { name: /sign in/i })).toBeEnabled();
  });

  // ── Successful login ──────────────────────────────────────────────────────
  it('calls loginRequest with the correct credentials', async () => {
    const user = userEvent.setup();
    const spy  = vi
      .spyOn(authApi, 'loginRequest')
      .mockResolvedValue({ access_token: 'tok', token_type: 'bearer', role: 'admin' });
    vi.spyOn(axiosMem, 'setMemoryToken').mockImplementation(() => {});

    renderLogin();
    await user.type(screen.getByLabelText(/username/i), 'admin');
    await user.type(screen.getByLabelText(/password/i), 'secret');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() =>
      expect(spy).toHaveBeenCalledWith({ username: 'admin', password: 'secret' }),
    );
  });

  it('stores the JWT in memory (calls setMemoryToken) on success', async () => {
    const user    = userEvent.setup();
    const memSpy  = vi.spyOn(axiosMem, 'setMemoryToken').mockImplementation(() => {});
    vi.spyOn(authApi, 'loginRequest').mockResolvedValue({
      access_token: 'my-jwt', token_type: 'bearer', role: 'admin',
    });

    renderLogin();
    await user.type(screen.getByLabelText(/username/i), 'admin');
    await user.type(screen.getByLabelText(/password/i), 'pw');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => expect(memSpy).toHaveBeenCalledWith('my-jwt'));
  });

  it('redirects to /dashboard/admin for admin role', async () => {
    const user = userEvent.setup();
    vi.spyOn(authApi,  'loginRequest')  .mockResolvedValue({ access_token: 't', token_type: 'bearer', role: 'admin' });
    vi.spyOn(axiosMem, 'setMemoryToken').mockImplementation(() => {});

    renderLogin();
    await user.type(screen.getByLabelText(/username/i), 'admin');
    await user.type(screen.getByLabelText(/password/i), 'pw');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard/admin', { replace: true }),
    );
  });

  it('redirects to /dashboard/facility_manager for that role', async () => {
    const user = userEvent.setup();
    vi.spyOn(authApi,  'loginRequest')  .mockResolvedValue({ access_token: 't', token_type: 'bearer', role: 'facility_manager' });
    vi.spyOn(axiosMem, 'setMemoryToken').mockImplementation(() => {});

    renderLogin();
    await user.type(screen.getByLabelText(/username/i), 'fm');
    await user.type(screen.getByLabelText(/password/i), 'pw');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard/facility_manager', { replace: true }),
    );
  });

  it('redirects to /dashboard/student for student role', async () => {
    const user = userEvent.setup();
    vi.spyOn(authApi,  'loginRequest')  .mockResolvedValue({ access_token: 't', token_type: 'bearer', role: 'student' });
    vi.spyOn(axiosMem, 'setMemoryToken').mockImplementation(() => {});

    renderLogin();
    await user.type(screen.getByLabelText(/username/i), 'stu');
    await user.type(screen.getByLabelText(/password/i), 'pw');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard/student', { replace: true }),
    );
  });

  // ── Error states ──────────────────────────────────────────────────────────
  it('shows invalid-credentials message on 401', async () => {
    const user = userEvent.setup();
    vi.spyOn(authApi, 'loginRequest').mockRejectedValue(makeAxiosError(401));

    renderLogin();
    await user.type(screen.getByLabelText(/username/i), 'bad');
    await user.type(screen.getByLabelText(/password/i), 'bad');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent(
        /invalid username or password/i,
      ),
    );
  });

  it('shows generic error message for non-401 failures', async () => {
    const user = userEvent.setup();
    vi.spyOn(authApi, 'loginRequest').mockRejectedValue(new Error('Network Error'));

    renderLogin();
    await user.type(screen.getByLabelText(/username/i), 'u');
    await user.type(screen.getByLabelText(/password/i), 'p');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent(/unexpected error/i),
    );
  });

  it('does NOT store token in memory on 401', async () => {
    const user   = userEvent.setup();
    const memSpy = vi.spyOn(axiosMem, 'setMemoryToken');
    vi.spyOn(authApi, 'loginRequest').mockRejectedValue(makeAxiosError(401));

    renderLogin();
    await user.type(screen.getByLabelText(/username/i), 'bad');
    await user.type(screen.getByLabelText(/password/i), 'bad');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => screen.getByRole('alert'));
    expect(memSpy).not.toHaveBeenCalled();
  });
});