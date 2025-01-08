import axios, { Axios, AxiosRequestConfig } from "axios";

const axiosReq = new Axios({
    ...axios.defaults,
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
} as AxiosRequestConfig);

export default axiosReq;
