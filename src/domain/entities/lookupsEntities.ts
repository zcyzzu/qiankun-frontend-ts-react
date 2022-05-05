/*
 * @Author: zhangchenyang
 * @Date: 2022-05-05 14:45:34
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-05-05 14:45:35
 */
/*
 * @Author: liyou
 * @Date: 2021-06-17 10:22:38
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-01-18 16:22:14
 */
import { CommonResponseDTO } from "../../common/config/commonConfig";

export interface LookupsEntity extends CommonResponseDTO {
  id?: number;
  code?: string;
  lookupId?: number;
  description?: string;
  displayOrder?: number;
  value: string;
  meaning: string;
  orderSeq: number;
}
