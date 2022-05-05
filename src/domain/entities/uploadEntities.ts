/*
 * @Author: liyou
 * @Date: 2021-06-28 17:50:22
 * @LastEditors: yaodongli
 * @LastEditTime: 2021-09-06 09:58:12
 */
export interface UploadEntity {
  bucket?: string;
  tenantId?: number;
  endPoint?: string;
  deleted?: boolean;
  name?: string;
  fileKey?: string;
  fileUrl?: string;
  id?: number;
  content?: string[];
  deletedBy?: number;
  deleteDate?: string;
}
