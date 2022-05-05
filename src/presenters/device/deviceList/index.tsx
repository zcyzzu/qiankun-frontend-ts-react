/*
 * @Author: zhangchenyang
 * @Date: 2021-11-23 17:45:44
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-03-02 15:20:51
 */
import React from 'react';
import { observer } from 'mobx-react';
import { Row } from 'antd';
import { isEmpty, toArray, throttle } from 'lodash';
import style from './style.less';
import DI from '../../../inversify.config';
import OrganizationTree from '../../../common/components/organizationTree';
import { DeviceType } from '../../../common/config/commonConfig';
import { OrganizationListEntity } from '../../../domain/entities/organizationEntities';
import DeviceListViewModel from './viewModel';
import AdvertisementMachine from '../advertisementMachine';
import RaspberryMachine from '../raspberryMachine';

import advertisingTab from '../../../assets/images/advertising_tab.svg';
import cashierTab from '../../../assets/images/cashier_tab.svg';
import ledTab from '../../../assets/images/led_tab.svg';
import raspberryTab from '../../../assets/images/raspberry_tab.svg';

import { DEVICE_IDENTIFIER } from '../../../constants/identifiers';

@observer
export default class DeviceList extends React.Component {
  private viewModel = DI.DIContainer.get<DeviceListViewModel>(
    DEVICE_IDENTIFIER.DEVICE_LIST_VIEW_MODEL,
  );

  private treeWrapperRef = React.createRef<HTMLDivElement>();
  private orgTreeDom = React.createRef<HTMLDivElement>();
  private handleresize = throttle((): void => {
    if (this.orgTreeDom.current) {
      this.orgTreeDom.current.style.height = `${this.treeWrapperRef.current?.clientHeight}px`;
    }
  }, 1000);
  componentDidMount(): void {
    window.addEventListener('resize', this.handleresize.bind(this));
  }
  componentWillUnmount(): void {
    window.removeEventListener('resize', this.handleresize.bind(this));
  }

  private getCurrentImg = (deviceType: DeviceType): string => {
    switch (deviceType) {
      case DeviceType.Advertisement:
        return advertisingTab;
      case DeviceType.Cashier:
        return cashierTab;
      case DeviceType.Led:
        return ledTab;
      case DeviceType.Raspberry:
        return raspberryTab;
      default:
        return advertisingTab;
    }
  };

  private getCurrentRender = (deviceType: string): JSX.Element => {
    const { unitId, storeId, getTabsList } = this.viewModel;
    switch (deviceType) {
      case DeviceType.Advertisement:
        return (
          <AdvertisementMachine
            deviceType={DeviceType.Advertisement}
            unitIds={unitId}
            storeIds={storeId}
            getTabsList={getTabsList}
          />
        );
      case DeviceType.Cashier:
        return (
          <AdvertisementMachine
            deviceType={DeviceType.Cashier}
            unitIds={unitId}
            storeIds={storeId}
            getTabsList={getTabsList}
          />
        );
      case DeviceType.Led:
        return (
          <AdvertisementMachine
            deviceType={DeviceType.Led}
            unitIds={unitId}
            storeIds={storeId}
            getTabsList={getTabsList}
          />
        );
      case DeviceType.Raspberry:
        return <RaspberryMachine unitIds={unitId} storeIds={storeId} getTabsList={getTabsList} />;
      default:
        return (
          <AdvertisementMachine
            deviceType={DeviceType.Advertisement}
            unitIds={unitId}
            storeIds={storeId}
            getTabsList={getTabsList}
          />
        );
    }
  };

  private getCurrentSelected = (e: OrganizationListEntity): void => {
    const { setUnitId, setStoreId } = this.viewModel;
    if (!isEmpty(e)) {
      if (e.unitId) {
        setUnitId(e.unitId);
      } else if (e.storeId) {
        setStoreId(e.storeId);
      }
    }
  };

  private getDeviceName = (deviceType: string): string => {
    switch (deviceType) {
      case DeviceType.Advertisement:
        return '广告机';
      case DeviceType.Cashier:
        return '收银机';
      case DeviceType.Led:
        return 'LED';
      case DeviceType.Raspberry:
        return '树莓派';
      default:
        return '广告机';
    }
  };

  public render(): JSX.Element {
    const { deviceInfo, setCurrentDevicetype, currentDevicetype } = this.viewModel;

    return (
      <div className={style.deviceListConatiner}>
        <div
          className={style.organationTreeWrapper}
          ref={this.orgTreeDom}
          style={{ height: this.treeWrapperRef.current?.clientHeight }}
        >
          <OrganizationTree
            treeWrapper={style.treeWrapper}
            showLine={{ showLeafIcon: false }}
            getCurrentSelectedInfo={(e: OrganizationListEntity): void => this.getCurrentSelected(e)}
          />
        </div>
        <div className={style.deviceListWrapper} ref={this.treeWrapperRef}>
          <Row className={style.deviceListTabs}>
            {console.log('deviceInfo', Object.keys(deviceInfo))}
            {deviceInfo &&
              Object.keys(deviceInfo).map((ele, index) => {
                if (ele === DeviceType.Raspberry) {
                  return <></>;
                }
                return (
                  <div onClick={(): void => setCurrentDevicetype(ele)}>
                    <span>{this.getDeviceName(ele)}</span>
                    <p>{toArray(deviceInfo)[index]}台</p>
                  </div>
                );
              })}
            <img src={this.getCurrentImg(currentDevicetype)} className={style.tabsImg} alt="" />
          </Row>
          {this.getCurrentRender(currentDevicetype)}
        </div>
      </div>
    );
  }
}
