/*
 * @Author: tongyuqiang
 * @Date: 2021-11-24 14:24:15
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-03-21 15:05:41
 */
import React from 'react';
import { observer } from 'mobx-react';
import { Row, Col } from 'antd';
import DI from '../../../../inversify.config';
import style from './style.less';

import AdvertisementMachineViewModel from '../../advertisementMachine/viewModel';
import DeviceDetailsModalViewModel from '../../deviceDetailsModal/viewModel';
import { DeviceType } from '../../../../common/config/commonConfig';
import { DEVICE_IDENTIFIER } from '../../../../constants/identifiers';
import DeviceListViewModel from '../../deviceList/viewModel';

@observer
export default class DeviceInfo extends React.Component {
  private advertisementMachineViewModel = DI.DIContainer.get<AdvertisementMachineViewModel>(
    DEVICE_IDENTIFIER.ADVERTISEMENT_MACHINE_VIEW_MODEL,
  );

  private deviceDetailsModalViewModel = DI.DIContainer.get<DeviceDetailsModalViewModel>(
    DEVICE_IDENTIFIER.DEVICE_DETAILS_MODEL_VIEW_MODEL,
  );

  private deviceListViewModel = DI.DIContainer.get<DeviceListViewModel>(
    DEVICE_IDENTIFIER.DEVICE_LIST_VIEW_MODEL,
  );

  public render(): JSX.Element {
    const { currentDeviceType, deviceListItemData } = this.advertisementMachineViewModel;

    return (
      <div className={style.deviceInfoContainer}>
        <Row>
          <Col span={12} className={style.title}>
            组织名称：<span>{deviceListItemData.unitName}</span>
          </Col>
          <Col span={12} className={style.title}>
            设备类型：
            <span>{this.generateDeviceType(deviceListItemData.type)}</span>
          </Col>
          {currentDeviceType === DeviceType.Advertisement ||
          currentDeviceType === DeviceType.Led ? (
            <>
              <Col span={12} className={style.title}>
                设备名称：<span>{deviceListItemData.name}</span>
              </Col>
              <Col span={12} className={style.title}>
                所属项目/门店：<span>{deviceListItemData.storeName}</span>
              </Col>
            </>
          ) : (
            <>
              <Col span={12} className={style.title}>
                点位品牌名称：<span>{deviceListItemData.pointBrandName}</span>
              </Col>
              <Col span={12} className={style.title}>
                品牌业态：<span>{deviceListItemData.brandFormat}</span>
              </Col>
            </>
          )}
          {currentDeviceType === DeviceType.Cashier && (
            <Col span={12} className={style.title}>
              所属项目/门店：<span>{deviceListItemData.storeName}</span>
            </Col>
          )}
          <Col span={12} className={style.title}>
            所在楼层：<span>{deviceListItemData.floor}</span>
          </Col>
          <Col span={12} className={style.title}>
            分辨率值：<span>{deviceListItemData.resolution}</span>
          </Col>
          <Col span={12} className={style.title}>
            IP地址：<span>{deviceListItemData.ipAddress}</span>
          </Col>
          <Col span={12} className={style.title}>
            设备状态：<span>{deviceListItemData.status === '0' ? '禁用' : '启用'}</span>
          </Col>
          <Col span={12} className={style.title}>
            设备分组：
            <span className={style.deviceGroup}>{this.generateDeviceGroup()}</span>
          </Col>
          <Col span={12} className={style.title}>
            分管部门：
            <span>{this.generateManagerDepartment()}</span>
          </Col>
          <Col span={12} className={style.title}>
            特征广告：
            <span>{this.generateSupportedFeature(deviceListItemData.supportedFeature)}</span>
          </Col>
          <Col span={12} className={style.title}>
            Mac地址：
            <span>
              {deviceListItemData.macAddress || '- -'}
            </span>
          </Col>
          <Col span={12} className={style.title}>
            操作系统：<span>{deviceListItemData.os || '- -'}</span>
          </Col>
          <Col span={12} className={style.title}>
            UUID：<span>{deviceListItemData.deviceUuid || '- -'}</span>
          </Col>
          <Col span={12} className={style.title}>
            应用版本号：<span>{deviceListItemData.clientVersionNumber || '- -'}</span>
          </Col>
        </Row>
      </div>
    );
  }

  private generateDeviceType = (type: string | undefined): string => {
    const { deviceTypeData } = this.deviceListViewModel;
    const data = deviceTypeData.find((item) => {
      return item.value === type;
    });
    return data?.meaning || '未知';
  };

  private generateSupportedFeature = (record: boolean | undefined): string => {
    const { supportedFeatureData } = this.deviceDetailsModalViewModel;
    const recordNum = record ? '1' : '0';
    const data = supportedFeatureData.find((item) => {
      return item.value === recordNum;
    });
    return data?.meaning || '';
  };

  private generateDeviceGroup = (): string => {
    const { deviceListItemData } = this.advertisementMachineViewModel;
    let str = '';
    deviceListItemData.groupNameList?.forEach((item) => {
      str += `${item.groupName}、`;
    });
    str = str.substring(0, str.length - 1);
    return str || '- -';
  };

  private generateManagerDepartment = (): string => {
    const { deviceListItemData } = this.advertisementMachineViewModel;
    let str = '';
    deviceListItemData.managerDepartmentList?.forEach((item) => {
      str += `${item.managerDepartmentName}、`;
    });
    str = str.substring(0, str.length - 1);
    return str || '- -';
  };
}
