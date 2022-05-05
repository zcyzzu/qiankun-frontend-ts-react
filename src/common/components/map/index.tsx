/*
 * @Author: zhangchenyang
 * @Date: 2021-12-02 10:35:28
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 12:05:46
 */
import React from 'react';
import { observer } from 'mobx-react';
import { Input } from 'antd';
import AMapLoader from '@amap/amap-jsapi-loader';
import mapConfig from './mapTypes';
import { geocoders } from '../../../types/geocoder';
import { Searchs } from '../../../types/search';
import { AMapJs } from '../../../types/amapJs';
import style from './style.less';

interface MapComponentProps {
  // 获取当前点击的地址信息
  getCurrentLocation(data: LocationInfo): void;
}

export interface LocationInfo {
  city?: string;
  cityCode?: string;
  district?: string;
  adcode?: string;
  formattedAddress?: string;
  lng?: number;
  lat?: number;
}

@observer
export default class MapComponent extends React.Component<MapComponentProps> {
  componentDidMount(): void {
    const { getCurrentLocation } = this.props;
    AMapLoader.load({
      key: mapConfig.amapkey,
      version: '1.4.15',
    }).then((AMap) => {
      const map = new AMap.Map('container', {});
      //为地图注册click事件获取鼠标点击出的经纬度坐标
      map.on('click', (e: AMapJs.MapsEventOptions) => {
        const lngLat = [e.lnglat.getLng(), e.lnglat.getLat()];
        // 点击获取经纬度和地址信息
        AMap.plugin(['AMap.Geocoder'], () => {
          const geocoder = new AMap.Geocoder({
            city: '全国',
            radius: 1000,
            extensions: 'all',
          });
          geocoder.getAddress(
            lngLat,
            (
              status: geocoders.Geocoder.SearchStatus,
              result: geocoders.Geocoder.ReGeocodeResult,
            ): void => {
              if (status === 'complete' && result.info === 'OK') {
                if (result && result.regeocode) {
                  getCurrentLocation({
                    city: result.regeocode.addressComponent.city,
                    cityCode: result.regeocode.addressComponent.citycode,
                    district: result.regeocode.addressComponent.district,
                    adcode: result.regeocode.addressComponent.adcode,
                    formattedAddress: result.regeocode.formattedAddress,
                    lng: e.lnglat.getLng(),
                    lat: e.lnglat.getLat(),
                  });
                }
              }
            },
          );
        });
      });
      // 关键字搜索
      AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.CitySearch'], () => {
        const autoOptions = {
          input: 'amapInput',
        };
        const autoComplete = new AMap.Autocomplete(autoOptions);
        const placeSearch = new AMap.PlaceSearch({
          map,
        });
        // 监听下拉框选中事件
        AMap.event.addListener(autoComplete, 'select', (event: any) => {
          placeSearch.setCity(event.poi.adcode);
          placeSearch.search(event.poi.name);
        });
        const citySearch = new AMap.CitySearch();
        citySearch.getLocalCity(
          (status: Searchs.CitySearch.SearchStatus, result: Searchs.CitySearch.SearchResult) => {
            if (status === 'complete' && result.info === 'OK') {
              if (result && result.city && result.bounds) {
                map.setBounds(result.bounds);
              }
            }
          },
        );
      });
    });
  }

  render(): JSX.Element {
    return (
      <div className={style.container}>
        <Input.Search placeholder="关键字搜索" id="amapInput" className={style.search} />
        <div id="container" className={style.map} />
      </div>
    );
  }
}
