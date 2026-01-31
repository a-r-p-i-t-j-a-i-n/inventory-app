import { apiSlice } from '../../store/apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: ({ pageNumber, keyword }) => ({
                url: '/products',
                params: { pageNumber, keyword },
            }),
            providesTags: ['Product'],
        }),
        getProductDetails: builder.query({
            query: (id) => `/products/${id}`,
            keepUnusedDataFor: 5,
        }),
        createProduct: builder.mutation({
            query: (data) => ({
                url: '/products',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Product', 'Stock'],
        }),
        updateProduct: builder.mutation({
            query: (data) => ({
                url: `/products/${data._id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Product', 'Stock'],
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Product'],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductDetailsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productsApiSlice;
