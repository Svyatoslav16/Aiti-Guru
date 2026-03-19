import type { IProduct, IProductsResponse } from '../types/product';

const API_BASE_URL = '/api/products';

export const productsApi = {
  getAll: async (
    limit: number = 20,
    skip: number = 0,
    sortBy?: string,
    order?: string,
    searchQuery?: string,
  ): Promise<IProductsResponse> => {
    const params = new URLSearchParams({
      limit: limit.toString(),
      skip: skip.toString(),
    });

    if (sortBy) {
      params.append('sortBy', sortBy);
      params.append('order', order || 'asc');
    }

    if (searchQuery) {
      params.append('q', searchQuery);
    }

    const response = await fetch(`${API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    return response.json();
  },

  search: async (query: string): Promise<IProductsResponse> => {
    const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);

    if (!response.ok) {
      throw new Error('Failed to search products');
    }

    return response.json();
  },

  getById: async (id: number): Promise<IProduct> => {
    const response = await fetch(`${API_BASE_URL}/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }

    return response.json();
  },

  create: async (product: Partial<IProduct>): Promise<IProduct> => {
    // Имитация создания
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Date.now(),
          ...product,
          images: [],
          thumbnail: '',
          discountPercentage: 0,
          rating: 0,
          stock: 0,
          reviews: [],
          dimensions: { width: 0, height: 0, depth: 0 },
          meta: {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            barcode: '',
            qrCode: '',
          },
        } as IProduct);
      }, 500);
    });
  },
};
