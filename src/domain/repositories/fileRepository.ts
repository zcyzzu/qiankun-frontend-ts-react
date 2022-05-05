/*
 * @Author: zhangchenyang
 * @Date: 2021-12-09 14:12:00
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-03-03 15:19:48
 */
import { TemplateDownloadEntity } from '../entities/fileEntities';

export default interface FileRepository {
  // 文件上传 返回文件url
  uploadForUrl(
    file: File,
    bucketName: string,
    fileName?: string,
    progressCallback?: (percentage: number) => void,
  ): Promise<string>;

  // 文件上传 返回文件key
  uploadForKey(
    file: File,
    bucketName: string,
    fileName?: string,
    progressCallback?: (percentage: number) => void,
  ): Promise<string>;

  // 根据文件key 获取文件url(临时链接)
  getPreviewUrl(fileKey: string): Promise<TemplateDownloadEntity>;

  // 根据key下载文件
  downloadByKey(fileKey: string): Promise<File>;
}
