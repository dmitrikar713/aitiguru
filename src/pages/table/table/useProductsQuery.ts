import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { ProductsResponse } from "./types";

export type Order = "asc" | "desc";
export type Sort = "title" | "brand" | "sku" | "rating" | "price";

interface FetchProductsParams {
  skip: number;
  limit: number;
  sortBy: Sort;
  order: Order;
}

const fetchProducts = async (params: FetchProductsParams): Promise<ProductsResponse> => {
  const response = await axios.get<ProductsResponse>("https://dummyjson.com/products", {
    params: {
      limit: params.limit,
      skip: params.skip,
      select: "title,price,brand,rating,sku,category",
      sortBy: params.sortBy,
      order: params.order,
    },
  });
  return response.data;
};

export const useProductsQuery = (
  skip: number,
  limit: number,
  sortBy: Sort,
  order: Order,
) => {
  return useQuery({
    queryKey: ["products", skip, limit, sortBy, order],
    queryFn: () => fetchProducts({ skip, limit, sortBy, order }),
  });
};
