import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Product, ProductFormData, ProductFormErrors } from '../types';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    tags: [],
  });
  const [priceInput, setPriceInput] = useState('0');
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [degraded, setDegraded] = useState<boolean>(false);

  const { data: product, error: fetchError, isLoading: isProductLoading } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/products/${id}`);
        setDegraded(false);
        return response.data;
      } catch (err: any) {
        if (err.response) {
          if (err.response.status === 404) {
            setApiError('Product not found.');
          } else if (err.response.status === 503 ) {
            setDegraded(true);
            setApiError(null);
          } else {
            setApiError(err.response.data?.message || 'Failed to fetch product.');
          }
        } else if (err.request) {
          setApiError('Network error. Please check your connection.');
        } else {
          setApiError('An unexpected error occurred.');
        }
        throw err;
      }
    },
    enabled: isEditing,
    retry: false,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        tags: product.tags,
      });
      setPriceInput(product.price.toString());
    }
  }, [product]);

  useEffect(() => {
    if (degraded) {
      setApiError(null);
    }
  }, [degraded]);

  const createMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const response = await axios.post('/api/products', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      navigate('/products');
    },
    onError: (err: any) => {
      if (err.response) {
        setApiError(err.response.data?.message || 'Failed to create product.');
      } else if (err.request) {
        setApiError('Network error. Please check your connection.');
      } else {
        setApiError('An unexpected error occurred.');
      }
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const response = await axios.put(`/api/products/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      navigate('/products');
    },
    onError: (err: any) => {
      if (err.response) {
        setApiError(err.response.data?.message || 'Failed to update product.');
      } else if (err.request) {
        setApiError('Network error. Please check your connection.');
      } else {
        setApiError('An unexpected error occurred.');
      }
    }
  });

  const validateForm = () => {
    const newErrors: ProductFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    if (!validateForm()) {
      return;
    }
    if (isEditing) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  if (isProductLoading) return <div className="text-center py-4">Loading...</div>;
  if (degraded) return <div className="text-center py-4 text-yellow-600 bg-yellow-100">Service is temporarily unavailable. Please try again later.</div>;
  if (apiError) return <div className="text-center py-4 text-red-600">Error: {apiError}</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        {isEditing ? 'Edit Product' : 'Create Product'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="input"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            className="input"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          {errors.description && <div className="error-message">{errors.description}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="price" className="form-label">
            Price
          </label>
          <input
            type="number"
            id="price"
            className="input"
            min="0"
            step="0.01"
            value={priceInput}
            onChange={(e) => {
              const value = e.target.value;
              setPriceInput(value);
              setFormData({ ...formData, price: value === '' ? 0 : parseFloat(value) });
            }}
          />
          {errors.price && <div className="error-message">{errors.price}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Tags</label>
          <div className="flex space-x-2">
            <input
              type="text"
              className="input"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="btn btn-primary"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="btn"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {isEditing ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
} 