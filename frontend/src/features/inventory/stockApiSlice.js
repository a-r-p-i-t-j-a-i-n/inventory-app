import { apiSlice } from '../../store/apiSlice';

export const stockApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardStats: builder.query({
            query: () => '/stock/dashboard',
            providesTags: ['Stock', 'Product'],
        }),
        addStockMovement: builder.mutation({
            query: (data) => ({
                url: '/stock',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Stock', 'Product'],
        }),
    }),
});

export const { useGetDashboardStatsQuery, useAddStockMovementMutation } = stockApiSlice;
