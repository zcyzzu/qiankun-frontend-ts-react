/*
 * @Author: wuhao
 * @Date: 2021-11-23 14:10:49
 * @LastEditors: liyou
 * @LastEditTime: 2022-04-16 09:32:37
 */
import { Moment } from 'moment';
import { SingleValueType, DefaultOptionType } from 'rc-cascader/lib/Cascader';
import { RangeValue } from 'rc-picker/lib/interface';

export default interface ExportModalViewModel {
  //表单提交成功事件
  formOnFinish(values: FormData): void;
  //标签弹窗状态
  exportModalVisible: boolean;
  //设置标签窗口状态
  setExportModalVisible(unitId?: number | undefined, storeId?: number | undefined): void;
  options: OptionsType[];
  optionsCashier: OptionsType[];
  optionsLed: OptionsType[];
  optionsAd: OptionsType[];
  // getSpecificAd(): void;
  queryChange(e: string): void;
  query: string;
  // 选择设备
  setDevice: (value: SingleValueType[], selectOptions: DefaultOptionType[][]) => void;
  deviceValue: SingleValueType[];
  // 选择广告
  setAdvertisement: (value: SingleValueType[], selectOptions: DefaultOptionType[][]) => void;
  advertismentValue: SingleValueType[];
  // 选择日期
  dateChange(dates: RangeValue<Moment>, dateStrings: string[]): void;
}

// 表单数据格式
export interface FormData {
  way: string;
  time: Moment[];
  advert: string[];
}

export interface OptionsType {
  label: string;
  value: string | number;
  children?: OptionsType[];
}
