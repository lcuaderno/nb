import { render, screen } from '@testing-library/react';
import ProductForm from './ProductForm';
import axios from 'axios';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../context/AuthContext';

// Mock product service or React Query hook if needed
jest.mock('../../../backend/src/services/product.service', () => ({
  // Provide mock implementations if your component uses them
  // Example: getProduct: jest.fn(() => Promise.resolve({ id: '1', name: '', price: 0, tags: [] }))
}));

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ProductForm', () => {
  it('renders Name input and Update button in edit mode', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { id: '1', name: 'Test Product', price: 10, tags: [], description: 'Test description' }
    });
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/products/1/edit']}>
          <AuthProvider>
            <Routes>
              <Route path="/products/:id/edit" element={<ProductForm />} />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );
    expect(await screen.findByLabelText(/name/i)).toBeInTheDocument();
    expect(await screen.findByText(/Update/i)).toBeInTheDocument();
  });
}); 