/*
 * @Author: wuhao
 * @Date: 2021-11-23 14:11:12
 * @LastEditors: wuhao
 * @LastEditTime: 2022-04-21 17:11:58
 */
import { Moment } from 'moment';
import { injectable, inject } from 'inversify';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { RangeValue } from 'rc-picker/lib/interface';
import { SingleValueType, DefaultOptionType } from 'rc-cascader/lib/Cascader';
import ExportModalViewModel, { OptionsType, FormData } from './viewModel';
import { ADVERTISEMENT_IDENTIFIER } from '../../../../constants/identifiers';
import AdvertisementUseCase from '../../../../domain/useCases/advertisementUseCase';
import { Devices } from '../../../../domain/entities/advertisementEntities';
import utils from '../../../../utils/index';

@injectable()
export default class ExportModalViewModelImpl implements ExportModalViewModel {
  // advertisementUseCase
  @inject(ADVERTISEMENT_IDENTIFIER.ADVERTISEMENT_USE_CASE)
  private AdvertisementUseCase!: AdvertisementUseCase;
  //标签弹窗状态
  public exportModalVisible: boolean;
  //标签弹窗状态
  public options: OptionsType[];
  public optionsCashier: OptionsType[];
  public optionsLed: OptionsType[];
  public query: string;
  public optionsAd: OptionsType[];
  public advertismentIds: number[];
  public deviceIds: number[];

  public deviceValue: SingleValueType[];
  public advertismentValue: SingleValueType[];
  public unitId: number | undefined;
  public storeId: number | undefined;
  public timeDate: string[];
  public constructor() {
    this.options = [];
    this.optionsCashier = [];
    this.optionsLed = [];
    this.optionsAd = [];
    this.query = 'advertising';
    this.exportModalVisible = false;
    this.advertismentIds = [];
    this.deviceIds = [];
    this.deviceValue = [];
    this.advertismentValue = [];
    this.unitId = undefined;
    this.storeId = undefined;
    this.timeDate = [];
    makeObservable(this, {
      timeDate: observable,
      unitId: observable,
      storeId: observable,
      advertismentValue: observable,
      deviceValue: observable,
      deviceIds: observable,
      advertismentIds: observable,
      optionsAd: observable,
      query: observable,
      exportModalVisible: observable,
      options: observable,
      optionsCashier: observable,
      optionsLed: observable,
      formOnFinish: action,
      setExportModalVisible: action,
      getSpecificDevices: action,
      queryChange: action,
      setDevice: action,
      setAdvertisement: action,
      dateChange: action,
    });
  }

  // 历史播放、历史任务日期选择
  public dateChange = (dates: RangeValue<Moment>, dateStrings: string[]): void => {
    if (this.query === 'advertising') {
      this.getSpecificAd(dateStrings);
    } else {
      this.getSpecificDevices(dateStrings);
    }
    this.timeDate = dateStrings;
    if (!dateStrings[0]) {
      this.advertismentValue = [];
      this.deviceValue = [];
    }
  };
  //选择方式
  public queryChange = (e: string): void => {
    this.query = e;
    if (this.timeDate.length > 0 && this.query === 'advertising') {
      this.getSpecificAd(this.timeDate);
    }

    if (this.timeDate.length > 0 && this.query === 'equipment') {
      this.getSpecificDevices(this.timeDate);
    }
    this.advertismentIds = [];
    this.deviceIds = [];
    this.deviceValue = [];
    this.advertismentValue = [];
  };
  // 选择广告
  public setAdvertisement = (
    value: SingleValueType[],
    selectOptions: DefaultOptionType[][],
  ): void => {
    this.advertismentValue = value;
    selectOptions.forEach((item) => {
      // 如果等于2的话，选择了广告
      if (((item as unknown) as Devices[]).length === 2) {
        this.advertismentIds.push(Number(((item as unknown) as Devices[])[1].value) || 0);
      }
      // 如果等于1的话，选择了全部
      if (((item as unknown) as Devices[]).length === 1) {
        ((item as unknown) as Devices[])[0].children?.forEach((floors) => {
          this.advertismentIds.push(Number(floors.value) || 0);
        });
      }
    });
  };

  // 选择设备
  public setDevice = (value: SingleValueType[], selectOptions: DefaultOptionType[][]): void => {
    this.deviceValue = value;
    selectOptions.forEach((item) => {
      // 如果等于4的话，选择了第3级的数据
      if (((item as unknown) as Devices[]).length === 4) {
        // 字段名转换
        let data = JSON.stringify(((item as unknown) as Devices[])[3]);
        data = data
          .replace(new RegExp('label', 'gm'), 'deviceName')
          .replace(new RegExp('value', 'gm'), 'id');
        const replaceData = JSON.parse(data);
        // 赋值给列表数据
        this.deviceIds.push(replaceData.id);
      }
      // 如果等于3的话，选择了某个楼层下的所有的数据
      if (((item as unknown) as Devices[]).length === 3) {
        ((item as unknown) as Devices[])[2].children?.forEach((floors) => {
          let data = JSON.stringify(floors);
          data = data
            .replace(new RegExp('label', 'gm'), 'deviceName')
            .replace(new RegExp('value', 'gm'), 'id');
          const replaceData = JSON.parse(data);
          // 赋值给列表数据
          this.deviceIds.push(replaceData.id);
        });
      }

      // 如果等于2的话，选择了某个门店下的所有的数据
      if (((item as unknown) as Devices[]).length === 2) {
        ((item as unknown) as Devices[])[1].children?.forEach((project) => {
          project.children?.forEach((projectAll) => {
            let data = JSON.stringify(projectAll);
            data = data
              .replace(new RegExp('label', 'gm'), 'deviceName')
              .replace(new RegExp('value', 'gm'), 'id');
            const replaceData = JSON.parse(data);
            // 赋值给列表数据
            this.deviceIds.push(replaceData.id);
          });
        });
      }

      // 如果等于1的话，选择了全部
      if (((item as unknown) as Devices[]).length === 1) {
        ((item as unknown) as Devices[])[0].children?.forEach((project) => {
          project.children?.forEach((projectAll) => {
            projectAll.children?.forEach((ite) => {
              let data = JSON.stringify(ite);
              data = data
                .replace(new RegExp('label', 'gm'), 'deviceName')
                .replace(new RegExp('value', 'gm'), 'id');
              const replaceData = JSON.parse(data);
              // 赋值给列表数据
              this.deviceIds.push(replaceData.id);
            });
          });
        });
      }
    });
  };

  // 获取具体广告
  public getSpecificAd = async (dateStrings: string[]): Promise<void> => {
    try {
      const data = await this.AdvertisementUseCase.getSpecificAd(
        dateStrings[0],
        dateStrings[1],
        this.unitId,
        this.storeId,
      );
      runInAction(() => {
        let resData = JSON.stringify(data);
        resData = resData
          .replace(new RegExp('adName', 'gm'), 'label')
          .replace(new RegExp('id', 'gm'), 'value');
        // this.optionsAd = JSON.parse(resData);
        if (JSON.parse(resData).length > 0) {
          this.optionsAd = [
            {
              label: '全部广告',
              value: 'all',
              children: JSON.parse(resData),
            },
          ];
        } else {
          this.optionsAd = JSON.parse(resData);
        }
      });
    } catch (e) {
      runInAction(() => {
        this.optionsAd = [];
      });
    }
  };

  // 获取具体设备 -项目门店-收银机
  // public getGcashierDevices = async (deviceTypeEnum: string): Promise<void> => {
  //   try {
  //     const data = await this.AdvertisementUseCase.getGcashierDevices(deviceTypeEnum);
  //     runInAction(() => {
  //       let resData = JSON.stringify(data);
  //       resData = resData
  //         .replaceAll('brandFormatList', 'children')
  //         .replaceAll('projectName', 'label')
  //         .replaceAll('projectId', 'value')
  //         .replaceAll('deviceList', 'children')
  //         .replaceAll('pointBrandName', 'label')
  //         .replaceAll('pointBrandCode', 'value')
  //         .replaceAll('pointBrandName', 'label')
  //         .replaceAll('id', 'value');
  //       this.optionsCashier = JSON.parse(resData);
  //       if (this.optionsCashier.length > 0) {
  //         this.options.push(this.optionsCashier[0]);
  //       }
  //     });
  //   } catch (e) {
  //     runInAction(() => {
  //       // this.optionsDevice = [];
  //     });
  //   }
  // };

  // 获取具体设备
  public getSpecificDevices = async (dateStrings: string[]): Promise<void> => {
    try {
      const data = await this.AdvertisementUseCase.getSpecificDevice(
        dateStrings[0],
        dateStrings[1],
        this.unitId,
        this.storeId,
      );
      runInAction(() => {
        let resData = JSON.stringify(data);
        resData = resData
          .replace(new RegExp('floors', 'gm'), 'children')
          .replace(new RegExp('projectName', 'gm'), 'label')
          .replace(new RegExp('projectId', 'gm'), 'value')
          .replace(new RegExp('devices', 'gm'), 'children')
          .replace(new RegExp('floorName', 'gm'), 'label')
          .replace(new RegExp('floorCode', 'gm'), 'value')
          .replace(new RegExp('deviceName', 'gm'), 'label')
          .replace(new RegExp('id', 'gm'), 'value');
        // if (deviceTypeEnum === 'ADMACHINE') {
        //   if (resData.length > 0) {
        //     this.options.push(JSON.parse(resData)[0]);
        //   }
        // }
        // if (deviceTypeEnum === 'CASHIER') {
        //   this.optionsCashier = JSON.parse(resData);
        //   this.options.push(this.optionsCashier[0]);
        // }
        // if (deviceTypeEnum === 'LED') {
        //   this.optionsLed = JSON.parse(resData);
        //   if (this.optionsLed.length > 0) {
        //     this.options.push(this.optionsLed[0]);
        //   }
        // }
        // this.options = JSON.parse(resData);
        if (JSON.parse(resData).length > 0) {
          this.options = [
            {
              label: '全部设备',
              value: 'all',
              children: JSON.parse(resData),
            },
          ];
        } else {
          this.options = JSON.parse(resData);
        }
      });
    } catch (e) {
      runInAction(() => {
        // this.options = [];
      });
    }
  };
  //表单提交成功事件
  public formOnFinish = (values: FormData): void => {
    const dataSourceAd = this.advertismentIds.filter((item, index) => {
      const idx = this.advertismentIds.findIndex((i) => {
        return item === i;
      });
      return index === idx;
    });

    const dataSourceDevice = this.deviceIds.filter((item, index) => {
      const idx = this.deviceIds.findIndex((i) => {
        return item === i;
      });
      return index === idx;
    });
    const { time } = values;
    let startDate = '';
    let endDate = '';
    if (time) {
      startDate = time[0].format('YYYY-MM-DD');
      endDate = time[1].format('YYYY-MM-DD');
    }
    if (this.query === 'advertising') {
      this.exportData(startDate, endDate, dataSourceAd);
    } else {
      this.deviceData(startDate, endDate, dataSourceDevice);
    }
  };

  // 设备导出
  public deviceData = async (
    startDate: string,
    endDate: string,
    dataSourceDevice: number[],
  ): Promise<void> => {
    const fillerType = 'single-sheet';
    const deviceIds = dataSourceDevice.join(',');
    const idsValue = '1,2,3,4,5,6,7';
    const exportTypeData = 'DATA';
    await this.AdvertisementUseCase.deviceExport(
      fillerType,
      exportTypeData,
      this.unitId,
      this.storeId,
      startDate,
      endDate,
      deviceIds,
      idsValue,
    )
      .then((res) => {
        const eleLink = document.createElement('a');
        const dateStart = startDate
        .replace(new RegExp('-', 'gm'), '');
        const dateEnd = endDate
        .replace(new RegExp('-', 'gm'), '');
        eleLink.download = `播放记录详单-按设备${dateStart}-${dateEnd}.xlsx`;
        eleLink.style.display = 'none';
        eleLink.href = URL.createObjectURL(res);
        document.body.appendChild(eleLink);
        eleLink.click();
        document.body.removeChild(eleLink);
        if (res.type) {
          utils.globalMessge({
            content: '导出成功!',
            type: 'success',
          });
          this.setExportModalVisible();
        } else {
          utils.globalMessge({
            content: '导出过程中发生错误，请联系管理员!',
            type: 'error',
          });
        }
      })
      .catch((err) => {
        utils.globalMessge({
          content: `导出失败${err.message}!`,
          type: 'error',
        });
      });
  };

  // 广告导出
  public exportData = async (
    startDate: string,
    endDate: string,
    dataSourceAd: number[],
  ): Promise<void> => {
    const fillerType = 'single-sheet';
    const adIds = dataSourceAd.join(',');
    const idsValue = '1,2,3,4,5,6';
    const exportTypeData = 'DATA';
    await this.AdvertisementUseCase.advertismentExport(
      fillerType,
      exportTypeData,
      this.unitId,
      this.storeId,
      startDate,
      endDate,
      adIds,
      idsValue,
    )
      .then((res) => {
        const eleLink = document.createElement('a');
        const dateStart = startDate
        .replace(new RegExp('-', 'gm'), '');
        const dateEnd = endDate
        .replace(new RegExp('-', 'gm'), '');
        eleLink.download = `播放记录详单-按广告${dateStart}-${dateEnd}.xlsx`;
        eleLink.style.display = 'none';
        eleLink.href = URL.createObjectURL(res);
        document.body.appendChild(eleLink);
        eleLink.click();
        document.body.removeChild(eleLink);
        if (res.type) {
          utils.globalMessge({
            content: '导出成功!',
            type: 'success',
          });
          this.setExportModalVisible();
        } else {
          utils.globalMessge({
            content: '导出过程中发生错误，请联系管理员!',
            type: 'error',
          });
        }
      })
      .catch((err) => {
        utils.globalMessge({
          content: `导出失败${err.message}!`,
          type: 'error',
        });
      });
  };

  //设置标签model显示隐藏
  public setExportModalVisible = (
    unitId?: number | undefined,
    storeId?: number | undefined,
  ): void => {
    if (unitId) {
      this.unitId = unitId;
    }
    if (storeId) {
      this.storeId = storeId;
    }

    this.deviceValue = [];
    this.advertismentValue = [];
    this.exportModalVisible = !this.exportModalVisible;
    this.timeDate = [];
    if (!this.exportModalVisible) {
      this.unitId = undefined;
      this.storeId = undefined;
      this.query = 'advertising';
    }
  };
}
