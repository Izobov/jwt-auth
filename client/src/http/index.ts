import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios"
import { AuthResponse } from "../models/response/AuthResponse";

export const API_URL = 'http://localhost:5000/api'

const api = axios.create({
    withCredentials: true,
    baseURL: API_URL
});

api.interceptors.request.use((config: AxiosRequestConfig)=> {
    (config.headers as AxiosRequestHeaders).Authorization = `Bearer ${localStorage.getItem("token")}`;
    return config
});

api.interceptors.response.use(
    (config) => config,
    async (err) => {
        const originalReq = err.config;
        if (err.response.status === 401) {
            if (!err.config._isRetry) {
                try {
                    const response = await api.get<AuthResponse>(`/refresh`);
                    localStorage.setItem('token', response.data.accessToken);
                    return api.request(originalReq);
                } catch (e) {
                    console.log("Unauthorized");
                }
            } else {
                // eslint-disable-next-line no-restricted-globals
                location.reload();
            }
        }
        throw err;
    }
)

export default api;