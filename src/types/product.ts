export type Product = {
  product_id: string;
  product_name: string;
  product_description: string;
  product_price: number;
  product_image: string;
  is_active: number;
  is_available: boolean;
  prepTimeMinutes: number;
};

export type Store = {
  store_id: string;
  store_name: string;
  categories: string;
  products: Product[];
  is_active: number;
};
