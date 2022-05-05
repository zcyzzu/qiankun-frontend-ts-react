/*
 * @Author: zhangchenyang
 * @Date: 2021-12-09 14:13:46
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-03-03 15:20:29
 */
import axios from 'axios';
import { injectable, inject } from 'inversify';
import ConfigProvider from '../common/config/configProvider';
import { CONFIG_IDENTIFIER, USER_IDENTIFIER } from '../constants/identifiers';
import FileRepository from '../domain/repositories/fileRepository';
import { TemplateDownloadEntity } from '../domain/entities/fileEntities';
import UserUseCase from '../domain/useCases/userUseCase';

@injectable()
export default class FileRepositoryImpl implements FileRepository {
  @inject(CONFIG_IDENTIFIER.CONFIG_PROVIDER)
  private configProvider!: ConfigProvider;

  @inject(USER_IDENTIFIER.USER_USE_CASE)
  private userUseCase!: UserUseCase;

  // 上传文件 返回文件url
  async uploadForUrl(
    file: File,
    bucketName: string,
    fileName?: string,
    progressCallback?: (percentage: number) => void,
  ): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await axios.post(
      `${this.configProvider.apiPublicUrl}/hfle/v1/${this.userUseCase.userInfo.tenantId}/files/multipart`,
      formData,
      {
        params: {
          bucketName,
          fileName: fileName || file.name,
        },
        onUploadProgress: (e) => {
          progressCallback && progressCallback(Math.round((e.loaded * 100) / e.total));
        },
      },
    );
    return data;
  }

  // 上传文件 返回文件key
  async uploadForKey(
    file: File,
    bucketName: string,
    fileName?: string,
    progressCallback?: (percentage: number) => void,
  ): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await axios.post(
      `${this.configProvider.apiPublicUrl}/hfle/v1/${this.userUseCase.userInfo.tenantId}/files/secret-multipart`,
      formData,
      {
        params: {
          bucketName,
          fileName: fileName || file.name,
        },
        onUploadProgress: (e) => {
          progressCallback && progressCallback(Math.round((e.loaded * 100) / e.total));
        },
      },
    );
    return data;
  }

  // 根据文件key 获取文件url(临时链接)
  async getPreviewUrl(fileKey: string): Promise<TemplateDownloadEntity> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/hfle/v1/${this.userUseCase.userInfo.tenantId}/files/file-url`,
      {
        params: {
          fileKey,
        },
      },
    );
    return data;
  }

  // 根据key下载文件
  async downloadByKey(fileKey: string): Promise<File> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/hfle/v1/${this.userUseCase.userInfo.tenantId}/files/download-by-key`,
      {
        params: {
          fileKey,
        },
        responseType: 'blob',
      },
    );
    return data;
  }
}
