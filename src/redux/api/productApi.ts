import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AllProductsResponse,
  CatetoriesResponse,
  DeleteProductRequest,
  MessageResponse,
  NewProductRequest,
  ProductsResponse,
  SearchProductRequest,
  SearchProductResponse,
  UpdateProductRequest,
} from "../../types/api-types";
const server = import.meta.env.VITE_SERVER;
// /api/v1/product/latest
export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${server}/api/v1/product/`,
  }),
  tagTypes: ["product"],
  endpoints: (builder) => ({
    latestProduct: builder.query<AllProductsResponse, string>({
      query: () => "latest",
      providesTags: ["product"],
    }),
    AllProduct: builder.query<AllProductsResponse, string>({
      query: (id) => `admin-products?id=${id}`,
      providesTags: ["product"],
    }),
    categories: builder.query<CatetoriesResponse, string>({
      query: () => `categories`,
      providesTags: ["product"],
    }),
    searchProduct: builder.query<SearchProductResponse, SearchProductRequest>({
      query: ({ price, search, sort, category, page }) => {
        let base = `all?search=${search}&page${page}`;
        if (price) base += `&price=${price}`;
        if (sort) base += `&sort=${sort}`;
        if (category) base += `&category=${category}`;

        return base;
      },
      providesTags: ["product"],
    }),

    productDetails: builder.query<ProductsResponse, string>({
      query: (id) => id,
      providesTags: ["product"],
    }),
    newProduct: builder.mutation<MessageResponse, NewProductRequest>({
      query: ({ formData, id }) => ({
        url: `new?id=${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["product"],
    }),
    updateProduct: builder.mutation<MessageResponse, UpdateProductRequest>({
      query: ({ formData, userId, productId }) => ({
        url: `${productId}?id=${userId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["product"],
    }),
    deleteProduct: builder.mutation<MessageResponse, DeleteProductRequest>({
      query: ({ userId, productId }) => ({
        url: `n${productId}?${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["product"],
    }),
  }),
});

export const {
  useLatestProductQuery,
  useAllProductQuery,
  useCategoriesQuery,
  useSearchProductQuery,
  useNewProductMutation,
  useProductDetailsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
