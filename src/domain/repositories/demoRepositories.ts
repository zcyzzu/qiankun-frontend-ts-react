/*
 * @Author: liyou
 * @Date: 2021-06-04 17:27:43
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-06-13 16:35:17
 */

import { DemoEntity } from '../entities/demoEntities';

export default interface RootContainerRepository {
  requestDemoResponse(): Promise<DemoEntity>;
}
