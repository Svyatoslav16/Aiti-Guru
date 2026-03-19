export interface IProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: IReview[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  images: string[];
  thumbnail: string;
}

export interface IReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface IProductsResponse {
  products: IProduct[];
  total: number;
  skip: number;
  limit: number;
}

export interface ISortConfig {
  field: keyof IProduct | null;
  direction: 'asc' | 'desc';
}

export interface IAddProductForm {
  title: string;
  price: number;
  brand: string;
  sku: string;
  category: string;
  description?: string;
}
