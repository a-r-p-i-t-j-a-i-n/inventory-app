import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://inventory-app-8p88.onrender.com/api'),
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.userInfo?.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Product', 'Stock', 'User'],
    endpoints: (builder) => ({}),
});
