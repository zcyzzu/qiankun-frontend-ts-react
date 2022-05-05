/*
 * @Author: mayajing
 * @Date: 2021-11-29 11:53:14
 * @LastEditors: mayajing
 * @LastEditTime: 2022-01-13 10:40:11
 */
import { CommonResponseDTO } from '../../common/config/commonConfig';
import { MaterialListItem } from './advertisementEntities';
// 上屏发布-缺省页列表
export interface PublishDefaultPageListItemConfig extends CommonResponseDTO {
  id?: number;
  unitName?: string; //组织名称
  name?: string; //缺省素材
  resolution?: string; //分辨率
  deviceType?: string; //设备类型
  lastUpdateDate?: string; //最新修改时间
  material?: MaterialListItem; //素材实体
  unitId?: number; //组织id
  materialId?: number;
  tenantId?: number;
  duration?: number; //播放时长
}

// 缺省管理-缺省页列表
export interface DefaultPageListItemConfig extends CommonResponseDTO {
  id?: number;
  material?: MaterialListItem; //素材实体
  name?: string; //缺省素材
  resolution?: string; //分辨率
  deviceType?: string; //设备类型
  lastUpdateDate?: string; //最新修改时间
  unitName?: string; //组织名称
  unitId?: number; //组织id
  duration?: number; //播放时长
}

// 上屏发布-新增缺省
export interface CreateDefaultEntity {
  deviceType?: string;
  duration?: number; //播放时长
  id?: number;
  materialId?: number; //素材id
  resolution?: string; //分辨率
  tenantId?: number; //设备类型
  unitId?: number; //组织Id
  unitName?: string; //组织名称
}
