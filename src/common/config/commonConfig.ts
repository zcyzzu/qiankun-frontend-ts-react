/*
 * @Author: liyou
 * @Date: 2021-06-18 14:47:51
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 14:23:24
 */

// 弹窗状态
export enum ModalStatus {
  // 新增
  Creat = 'creat',
  // 编辑
  Edit = 'edit',
  // 查看
  View = 'view',
}

// 上传类型
export enum UploadType {
  JPG = 'jpg',
  PNG = 'png',
  MP4 = 'mp4',
  WAV = 'wav',
  IMAGE = 'image',
  VIDEO = 'video',
  GIF = 'gif',
}

// 设备类型
export enum DeviceType {
  // 广告机
  Advertisement = 'ADMACHINE',
  // 收银机
  Cashier = 'CASHIER',
  // LED
  Led = 'LED',
  // 树莓派
  Raspberry = 'RASPBERRYPI',
}

// response公共DTO字段
export interface CommonResponseDTO {
  flex?: Map<string, Record<string, unknown>>;
  __status?: string;
  _innerMap?: Map<string, Record<string, unknown>>;
  _token?: string;
  __tls?: Map<string, Map<string, string>>;
  tableId?: string;
  objectVersionNumber?: number;
  createdBy?: number;
  creationDate?: Date | string;
  lastUpdatedBy?: number;
  lastUpdateDate?: Date | string;
}

// 带分页的response公共DTO字段
export interface CommonPagesGeneric<Type> {
  empty?: boolean;
  number?: number;
  numberOfElements?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
  content: Type[];
}

// ant design message组件props
type NoticeType = 'success' | 'error';
export interface AntMessageProps {
  content: React.ReactNode;
  type: NoticeType;
  duration?: number | null;
  icon?: React.ReactNode;
}
