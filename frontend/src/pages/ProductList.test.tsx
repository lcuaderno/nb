import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProductList from './ProductList';
import axios from 'axios';

// Mock product service or React Query hook if needed
jest.mock('../../../backend/src/services/product.service', () => ({
  // Provide mock implementations if your component uses them
  // Example: getProducts: jest.fn(() => Promise.resolve([]))
}));

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ProductList', () => {
  it('renders Products header and Add Product button', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { products: [], nextCursor: null, hasMore: false }
    });
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AuthProvider>
            <ProductList />
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );
    expect(await screen.findByText('Products')).toBeInTheDocument();
    expect(await screen.findByText('Add Product')).toBeInTheDocument();
  });
}); 