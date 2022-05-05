/*
 * @Author: liyou
 * @Date: 2021-06-04 17:27:43
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-05-05 14:54:41
 */
import {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import DI from "../inversify.config";
import ConfigProvider from "../common/config/configProvider";
import {
  ROOT_CONTAINER_IDENTIFIER,
  CONFIG_IDENTIFIER,
} from "../constants/identifiers";
import RootContainereViewModel from "../presenters/rootContainer/viewModel";
import history from "../history";

const onRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
  const { setLoading } = DI.DIContainer.get<RootContainereViewModel>(
    ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_VIEW_MODEL
  );
  setLoading(true);
  const newConfig: AxiosRequestConfig = config;
  newConfig.headers.authorization = window.authorization;
  // if ((newConfig.url?.includes('/demo') && !newConfig.url?.includes('/site')) ||
  // newConfig?.url?.includes('/hfle') || newConfig?.url?.includes('/iam/v1')) {
  //   const configUrlSep = newConfig.url.indexOf('v1');
  //     newConfig.url = `${newConfig.url.substring(0, configUrlSep + 3)}${
  //       userInfo.tenantId
  //     }/${newConfig.url.substring(configUrlSep + 3, newConfig.url.length)}`;
  // }
  // if (newConfig.url?.includes('/extension')) {
  //   const configUrlSep = newConfig.url.indexOf('extension');
  //   newConfig.url = `${newConfig.url.substring(0, configUrlSep + 10)}${
  //     userInfo.tenantId
  //   }/${newConfig.url.substring(configUrlSep + 10, newConfig.url.length)}`;
  // }
  return newConfig;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  console.error("[request error]", error);
  const { setLoading } = DI.DIContainer.get<RootContainereViewModel>(
    ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_VIEW_MODEL
  );
  setLoading(false);
  return Promise.reject(error);
};

const onResponse = (response: AxiosResponse): Promise<AxiosResponse> => {
  console.debug("[response]", response);
  const { setLoading } = DI.DIContainer.get<RootContainereViewModel>(
    ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_VIEW_MODEL
  );
  setLoading(false);
  // 处理操作失败并且code为200的情况
  if (response.data.failed) {
    return Promise.reject(response.data);
  }
  return Promise.resolve(response);
};

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
  const configProvider = DI.DIContainer.get<ConfigProvider>(
    CONFIG_IDENTIFIER.CONFIG_PROVIDER
  );
  console.error("[response error]", error);
  const { setLoading } = DI.DIContainer.get<RootContainereViewModel>(
    ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_VIEW_MODEL
  );
  setLoading(false);

  if (error.response?.status === 403) {
    history.push("/demo/notPass");
  }
  if (error.response?.status === 404) {
    history.push("/demo/notFound");
  }
  if (
    error.response?.status === 401 ||
    (error.response?.status === 403 &&
      (error.response?.data as string).includes(
        "error.permission.accessTokenExpired"
      ))
  ) {
    const encodedLoginRedirectUri = encodeURIComponent(
      `${window.location.href}&redirectFlag`
    );
    window.location.href = `${configProvider.apiPublicUrl}/oauth/oauth/authorize?response_type=token&client_id=client&state=&redirect_uri=${encodedLoginRedirectUri}`;
  }
  return Promise.reject(error);
};

export default function setupInterceptorsTo(
  axiosInstance: AxiosInstance
): AxiosInstance {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
}
