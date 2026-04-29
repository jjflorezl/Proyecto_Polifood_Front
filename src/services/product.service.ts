import productsMock from "../mocks/products.json";
import type { Product } from "../types/product";
import { apiConfig, apiRequest } from "./api";

export const productService = {
  async getAll(): Promise<Product[]> {
    if (apiConfig.useMocks) return productsMock as Product[];
    return apiRequest<Product[]>("/Product");
  },

  async getById(id: string): Promise<Product> {
    if (apiConfig.useMocks) {
      const product = (productsMock as Product[]).find(p => p.product_id === id);
      if (!product) throw new Error("Producto no encontrado");
      return product;
    }
    return apiRequest<Product>(`/Product/${id}`);
  }
};
