import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type {RootState} from "../store";
import type {AuthRequest, AuthResponse, User} from "../interfaces/auth.interface";
import {AxiosError} from "axios";

import {$host} from "../http";

export interface State {
    userData: User | null,
    status: string
    error: string | null;
}

const userDataStr = sessionStorage.getItem('userData');

const initialState: State = {
    userData: userDataStr ? JSON.parse(userDataStr) : null,
    status: 'LOADING',
    error: null
};

export const saveUserDataToLocalStorage = (data: any) => {
    const {user, accessToken} = data;
    sessionStorage.setItem('userData', JSON.stringify(user));
    sessionStorage.setItem('access_token', JSON.stringify(accessToken));
}

export const removeUserDataFromLocalStorage = () => {
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('access_token');
}

export const loginThunk = createAsyncThunk<AuthResponse, AuthRequest, { rejectValue: AxiosError }>('/user/loginThunk', async (params, {rejectWithValue}) => {
    try {
        const response = await $host.post('/auth/login', params);
        return response.data;
    } catch (error) {
        return rejectWithValue(error as AxiosError);
    }
});

export const logoutThunk = createAsyncThunk<void, void, { rejectValue: AxiosError }>('/user/logoutThunk', async (params, {rejectWithValue}) => {
    try {
        await $host.post('/auth/logout', params);
    } catch (error) {
        return rejectWithValue(error as AxiosError);
    }
});

export const checkThunk = createAsyncThunk<AuthResponse, void, { rejectValue: AxiosError }>('/user/checkThunk', async (params, {rejectWithValue}) => {
    try {
        const response = await $host.post('/auth/refresh', params);
        return response.data;
    } catch (error) {
        return rejectWithValue(error as AxiosError);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.userData = null;
            state.status = 'SUCCESS';
            state.error = '';

            removeUserDataFromLocalStorage();
        }
    },
    extraReducers: (builder) => {
        //Login
        builder.addCase(loginThunk.pending, (state) => {
            state.userData = null;
            state.status = 'LOADING';
            state.error = '';
        });
        builder.addCase(loginThunk.fulfilled, (state, action) => {
            const {user} = action.payload;
            state.userData = user ? user : null;
            state.status = 'SUCCESS';
            state.error = '';

            console.log('action.payload', action.payload);
            saveUserDataToLocalStorage(action.payload);
        });
        builder.addCase(loginThunk.rejected, (state, action) => {
            state.userData = null;
            state.status = 'ERROR';
            if (action.payload) {
                state.error = action.payload.response && (action.payload.response?.data as {detail: string})?.detail ||  'Unknown error.';
            } else {
                state.error = 'Unknown error.';
            }
        });

        //check auth
        builder.addCase(checkThunk.pending, (state) => {
            // state.userData = null;
            state.status = 'LOADING';
            state.error = '';
        });
        builder.addCase(checkThunk.fulfilled, (state, action) => {
            const {user} = action.payload;
            state.userData = user ? user : null;
            state.status = 'SUCCESS';
            state.error = '';

            console.log('action.payload', action.payload);
            saveUserDataToLocalStorage(action.payload);
        });
        builder.addCase(checkThunk.rejected, (state, action) => {
            state.userData = null;
            state.status = 'ERROR';
            if (action.payload) {
                state.error = action.payload.response && (action.payload.response.data as {statusCode: number, message: string})?.message ||  'Unknown error.';
            } else {
                state.error = 'Unknown error.';
            }
        });

        //logout
        builder.addCase(logoutThunk.pending, (state) => {
            // state.userData = null;
            state.status = 'LOADING';
            state.error = '';
        });
        builder.addCase(logoutThunk.fulfilled, (state) => {
            state.userData = null;
            state.status = 'SUCCESS';
            state.error = '';

            removeUserDataFromLocalStorage();
        });
        builder.addCase(logoutThunk.rejected, (state, action) => {
            state.userData = null;
            state.status = 'ERROR';
            if (action.payload) {
                state.error = action.payload.response && (action.payload.response.data as {statusCode: number, message: string})?.message ||  'Unknown error.';
            } else {
                state.error = 'Unknown error.';
            }
        });
    }
});

export const selectUser = (state: RootState) => state.auth;
export const selectUserData = (state: RootState) => state.auth.userData;
export const selectIsAuth = (state: RootState) => state.auth.userData !== null;
// export const selectHasPermission = (key: string) => (state: RootState) => state.user.userData.role?.permissions.includes(key);
// export const selectHasCRUDPermissions = (key: string) => (state: RootState) => ({
//     read: state.user.userData.role?.permissions.includes(`${key}:read`) || state.user.userData.role.id === 1,
//     create: state.user.userData.role?.permissions.includes(`${key}:create`) || state.user.userData.role.id === 1,
//     update: state.user.userData.role?.permissions.includes(`${key}:update`) || state.user.userData.role.id === 1,
//     delete: state.user.userData.role?.permissions.includes(`${key}:delete`) || state.user.userData.role.id === 1,
// })

export const authReducer = authSlice.reducer;

export const {logout} = authSlice.actions;

// export const unauthorizedErrorMiddleware: Middleware = (api) => (next) => (action: any) => {
//     if (isRejectedWithValue(action)) {
//         if (action.payload.status === 401) {        
//             const {dispatch} = api;
//             dispatch(logout());
//         }
//     }
//     return next(action);
// }