import axios from "axios";

let onLogout: (() => void) | null = null;

export const setLogoutHandler = (fn: () => void) => {
    onLogout = fn;
};

const $host = axios.create({
    baseURL: import.meta.env.VITE_API_URI,
    withCredentials: true,
});

$host.interceptors.request.use(config => {
    const token = sessionStorage.getItem('access_token');

    if (token) {
        config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
    }

    return config;
});

$host.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;

    if ((error.response?.status === 401) && !originalRequest._retry && !originalRequest.url.includes('/auth/refresh')) {
        originalRequest._retry = true;

        try {
            const res = await $host.post('/auth/refresh');
            sessionStorage.setItem('access_token', JSON.stringify(res.data.accessToken));
            return $host(originalRequest);
        } catch (e) {
            onLogout?.();
        }
    }

    return Promise.reject(error);
  }
);

export {$host};