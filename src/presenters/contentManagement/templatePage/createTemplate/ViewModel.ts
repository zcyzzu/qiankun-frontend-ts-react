/*
 * @Author: wuhao
 * @Date: 2021-09-22 11:00:03
 * @LastEditors: mayajing
 * @LastEditTime: 2022-04-18 10:29:12
 */

export default interface CreateTemplateViewModel {
  visible: boolean;
  setIsVisible(val?: boolean): void;
  width: number;
  height: number;
  // 改变宽高value值
  changeValue(width: number, height: number): void;
  // width的change事件
  onWidthChange(width: number): void;
  // height的change事件
  onHeightChange(height: number): void;
  // 打开编辑器
  openEditor(): void;
  // 锁定宽高比
  onWidthLock(): void;
  onHeightLock(): void;
}
