export interface Product {
  id: number;
  title: string;
  price: number;
  brand: string;
  rating: number;
  sku: string;
  category: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

