import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import queryString from "query-string";

const baseURL = process.env.REACT_APP_BASE_URL

const getAccessToken = () => {
    let token: string = localStorage.getItem(AppConstants.token) ?? '';
    if (token && token.length > 0) {
        token = JSON.parse(token);
    }
    return token;
}

const axiosInstace = axios.create({
    baseURL: baseURL,
    headers: {
        'Accept': '*',
        'Content-Type': 'application/json'
    },
    paramsSerializer: (params) => queryString.stringify(params)
})

const onRequest = (config: any) => {
    const token = getAccessToken();
    config.headers = {
        Authorization: token ? `Bearer ${token}` : '',
        Accept: 'application/json',
        ...config.headers
    }
    return { ...config, data: config.data ?? null };
}
const onRequestError = (error: AxiosError): Promise<AxiosError> => {
    console.error(`[request error] [${JSON.stringify(error)}]`);
    return Promise.reject(error);
}

const onResponse = (response: AxiosResponse): AxiosResponse => {
    console.info(`[response] [${JSON.stringify(response)}]`);
    return response;
}

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
    console.error(`[response error] [${JSON.stringify(error)}]`);
    return Promise.reject(error);
}
axiosInstace.interceptors.request.use(onRequest, onRequestError);
axiosInstace.interceptors.response.use(onResponse, onResponseError);

export default axiosInstace;