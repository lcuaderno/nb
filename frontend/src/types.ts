export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  tags: string[];
  category?: string;
  brand?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  tags: string[];
  category?: string;
  brand?: string;
}

export interface ProductFormErrors {
  name?: string;
  description?: string;
  price?: string;
  tags?: string;
  category?: string;
  brand?: string;
} 