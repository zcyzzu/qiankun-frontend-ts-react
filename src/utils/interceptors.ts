/*
 * @Author: liyou
 * @Date: 2021-06-04 17:27:43
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-06-13 17:53:00
 */
import {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

const onRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
  const newConfig: AxiosRequestConfig = config;
  return newConfig;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  console.error("[request error]", error);
  return Promise.reject(error);
};

const onResponse = (response: AxiosResponse): Promise<AxiosResponse> => {
  console.debug("[response]", response);
  return Promise.resolve(response);
};

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
  console.error("[response error]", error);
  return Promise.reject(error);
};

export default function setupInterceptorsTo(
  axiosInstance: AxiosInstance
): AxiosInstance {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
}
