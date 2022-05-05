/*
 * @Author: tongyuqiang
 * @Date: 2022-04-06 16:01:02
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 14:23:37
 */
import { CommonResponseDTO } from '../../common/config/commonConfig';

export interface TemplateListItemEntity extends CommonResponseDTO {
  id?: string; // 模板id
  templateName: string; // 模板名称
  unitIdList?: number[]; // 组织id列表
  tenantId?: number; // 租户id
  previewUrl?: string; // 预览图地址
  deleted?: boolean;
  deletedBy?: number;
  deleteDate?: string;
  components?: ComponentsEntity[];
}

export interface ComponentsEntity {
  id?: string; // 组件id
  componentType?: string; // 组件类型
  width?: number; // 宽度
  height?: number; // 高度
  zIndex?: number; // 图层
  canvasBackgroundColor?: string; // 背景颜色
  canvasBackgroundImage?: string; // 背景图片
  transparency?: number; // 透明度
  rotationAngle?: number; // 旋转角度
  coordinateX?: number; // X轴坐标
  coordinateY?: number; // Y轴坐标
  borderStyle?: string; // 边框样式
  borderWidth?: number; // 边框宽度
  borderColor?: string; // 边框颜色
  materialKey?: string; // 素材key
  // 以下为图片组件属性
  fill?: string; // 填充方式
  roundedCorners?: number; // 圆角值
  // 以下为视频组件属性
  autoPlay?: boolean; // 是否自动播放
  loopPlay?: boolean; // 是否循环播放
  mute?: boolean; // 是否静音
}

export interface ComonPages<Type> {
  content: Type[];
  pageable?: PageableEntity;
  totalPages?: number;
  totalElements?: number;
  last?: boolean;
  number?: number;
  size?: number;
  numberOfElements?: number;
  sort?: SortEntity;
  first?: boolean;
}

export interface PageableEntity {
  sort?: SortEntity;
  pageSize?: number;
  pageNumber?: number;
  offset?: number;
  paged?: boolean;
  unpaged?: boolean;
}

export interface SortEntity {
  sorted?: boolean;
  unsorted?: boolean;
}
