import {useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:3010';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  tags: string[];
  category?: string;
  brand?: string;
}

export default function ProductList() {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [degraded, setDegraded] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [nextCursor, setNextCursor] = useState<{ createdAt: string } | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isInitialLoad = useRef(true);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchName, setSearchName] = useState('');
  const [searchTag, setSearchTag] = useState('');

  const fetchProducts = async (cursor?: { createdAt: string }, customLimit?: number, name?: string, tag?: string) => {
    try {
      setIsLoading(true);
      const params: any = { limit: customLimit ?? pageSize };
      if (cursor) {
        params.cursorCreatedAt = cursor.createdAt;
      }
      if (name) {
        params.name = name;
      }
      if (tag) {
        params.tag = tag;
      }
      const response = await axios.get('/api/products', { params });
      setDegraded(false);
      const { products: newProducts, nextCursor: newNextCursor, hasMore: newHasMore } = response.data;
      setProducts((prev) => {
        if (cursor) {
          return [...prev, ...newProducts];
        } else {
          return newProducts;
        }
      });
      setNextCursor(newNextCursor);
      setHasMore(newHasMore);
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      if (err.response) {
        if (err.response.status === 503) {
          setDegraded(true);
          setError(null);
        } else {
          setError(err.response.data?.message || 'Failed to fetch products.');
        }
      } else if (err.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred.');
      }
      throw err;
    }
  };

  useEffect(() => {
    fetchProducts(undefined, pageSize, searchName, searchTag);
    // eslint-disable-next-line
  }, [pageSize]);

  const handleLoadMore = () => {
    if (nextCursor) {
      fetchProducts(nextCursor, undefined, searchName, searchTag);
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value, 10);
    setPageSize(newSize);
    setProducts([]);
    setNextCursor(null);
    setHasMore(true);
    isInitialLoad.current = true;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setProducts([]);
    setNextCursor(null);
    setHasMore(true);
    fetchProducts(undefined, pageSize, searchName, searchTag);
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setDeleteId(null);
      fetchProducts(undefined, pageSize, searchName, searchTag);
    },
    onError: (err: any) => {
      if (err.response) {
        setError(err.response.data?.message || 'Failed to delete product.');
      } else if (err.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  });

  useEffect(() => {
    // Clear error if degraded is set (degraded takes precedence)
    if (degraded) {
      setError(null);
    }
  }, [degraded]);

  if (isLoading && isInitialLoad.current) {
    isInitialLoad.current = false;
    return <div className="text-center py-4">Loading...</div>;
  }
  if (degraded) return <div className="text-center py-4 text-yellow-600 bg-yellow-100">Service is temporarily unavailable. Please try again later.</div>;
  if (error) return <div className="text-center py-4 text-red-600">Error: {error}</div>;

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Products</h1>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex items-center gap-4">
          <label htmlFor="page-size" className="text-sm text-gray-700">Page size:</label>
          <select
            id="page-size"
            value={pageSize}
            onChange={handlePageSizeChange}
            className="input w-auto px-2 py-1 text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <Link
            to="/products/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            Add Product
          </Link>
        </div>
      </div>

      {/* Search form */}
      <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-center mt-4 mb-2">
        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={e => setSearchName(e.target.value)}
          className="input px-2 py-1 text-sm"
        />
        <input
          type="text"
          placeholder="Search by tag"
          value={searchTag}
          onChange={e => setSearchTag(e.target.value)}
          className="input px-2 py-1 text-sm"
        />
        <button type="submit" className="btn btn-primary px-4 py-1 text-sm">Search</button>
      </form>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Brand</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Tags</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {products?.map((product) => (
                    <tr key={product.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {product.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {product.description}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {product.category || '-'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {product.brand || '-'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {product.tags?.join(', ')}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link
                          to={`/products/${product.id}/edit`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {hasMore && !isLoading && (
        <div className="flex justify-center my-4">
          <button
            onClick={handleLoadMore}
            className="btn btn-primary"
          >
            Load More
          </button>
        </div>
      )}
      {isLoading && !isInitialLoad.current && (
        <div className="text-center py-4">Loading more...</div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Product</h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteId)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 