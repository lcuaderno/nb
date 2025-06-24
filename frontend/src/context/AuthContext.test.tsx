import { render, screen } from '@testing-library/react';
import React from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import userEvent from '@testing-library/user-event';

function TestComponent() {
  const { isAuthenticated, login, logout, token } = useAuth();
  return (
    <div>
      <div>auth: {isAuthenticated ? 'yes' : 'no'}</div>
      <div>token: {token || ''}</div>
      <button onClick={() => login('test-token')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe('AuthProvider and useAuth', () => {
  it('should default to not authenticated', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByText(/auth:/)).toHaveTextContent('auth: no');
  });

  it('should login and logout', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    const loginBtn = screen.getByText('Login');
    const logoutBtn = screen.getByText('Logout');
    await userEvent.click(loginBtn);
    expect(screen.getByText(/auth:/)).toHaveTextContent('auth: yes');
    expect(screen.getByText(/token:/)).toHaveTextContent('token: test-token');
    await userEvent.click(logoutBtn);
    expect(screen.getByText(/auth:/)).toHaveTextContent('auth: no');
    expect(screen.getByText(/token:/)).toHaveTextContent('token:');
  });
}); 