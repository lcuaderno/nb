import { render, screen } from '@testing-library/react';
import Layout from './Layout';
import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';

describe('Layout', () => {
  it('renders children and logout button', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Layout>
            <div>Test Child</div>
          </Layout>
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('Test Child')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.getByText('Product Admin')).toBeInTheDocument();
  });
}); 