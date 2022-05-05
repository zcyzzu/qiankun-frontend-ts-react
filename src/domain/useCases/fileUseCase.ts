/*
 * @Author: zhangchenyang
 * @Date: 2021-12-09 14:16:06
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-03-03 15:19:44
 */
import { inject, injectable } from 'inversify';
import { FILE_IDENTIFIER } from '../../constants/identifiers';
import FileRepository from '../repositories/fileRepository';
import { TemplateDownloadEntity } from '../entities/fileEntities';

@injectable()
export default class FileUseCase {
  @inject(FILE_IDENTIFIER.FILE_REPOSITORYL)
  private fileRepository!: FileRepository;

  // 文件上传 返回文件url
  public uploadForUrl(
    file: File,
    bucketName: string,
    fileName?: string,
    progressCallback?: (percentage: number) => void,
  ): Promise<string> {
    return this.fileRepository.uploadForUrl(file, bucketName, fileName, progressCallback);
  }

  // 文件上传 返回文件key
  public uploadForKey(
    file: File,
    bucketName: string,
    fileName?: string,
    progressCallback?: (percentage: number) => void,
  ): Promise<string> {
    return this.fileRepository.uploadForKey(file, bucketName, fileName, progressCallback);
  }

  // 根据文件key 获取文件url(临时链接)
  public getPreviewUrl(fileKey: string): Promise<TemplateDownloadEntity> {
    return this.fileRepository.getPreviewUrl(fileKey);
  }

  // 根据key下载文件
  public downloadByKey(fileKey: string): Promise<File> {
    return this.fileRepository.downloadByKey(fileKey);
  }
}
