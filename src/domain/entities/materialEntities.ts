/*
 * @Author: tongyuqiang
 * @Date: 2022-04-06 16:01:02
 * @LastEditors: liyou
 * @LastEditTime: 2022-04-19 16:46:40
 */
import { CommonResponseDTO } from '../../common/config/commonConfig';

export interface MaterialItemEntity extends CommonResponseDTO {
  id: number;
  description?: string; //描述
  duration?: string; //素材时长
  fileKey?: string; //素材文件key
  name?: string; //素材名称
  type?: string; //素材类型
  size?: string; //素材大小
  resolution?: string; //分辨率
  sourceType?: string; //资源类型
  fileHash?: string; //文件hash值
  key?: number;
  previewKey?: string; // 图片
}

// 创建素材
export interface CreateMaterialEntity {
  description?: string; // 描述
  duration?: number; // 素材时长
  fileHash?: string; // 文件hash值
  fileKey?: string; // 素材文件key
  name?: string; // 素材名称
  organization?: string; // 组织名称,
  unitId?: number; // 组织id
  resolution?: string; // 分辨率
  size?: string; // 素材大小，单位byte
  tenantId?: number; //租户id
  type?: string; // 素材类型
  previewKey?: string; // 图片
}
