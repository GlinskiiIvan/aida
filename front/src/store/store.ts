import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import {authReducer} from "./slices/auth";
import {noticesReducer} from "./slices/notices";
import { api } from './api/api';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        notices: noticesReducer,
        [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
})

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;