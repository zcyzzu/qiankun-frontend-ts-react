/*
 * @Author: liyou
 * @Date: 2021-07-09 10:24:35
 * @LastEditors: liyou
 * @LastEditTime: 2021-07-09 17:10:10
 */
import provinces from 'china-division/dist/provinces.json';
import cities from 'china-division/dist/cities.json';
import areas from 'china-division/dist/areas.json';

interface ProvincesOptions {
  code: string;
  name: string;
  children: AddressOptionsChildren[];
}

interface CitiesOptions {
  code: string;
  name: string;
  provinceCode: string;
  children: AddressOptionsChildren[];
}

interface AreasOptions {
  code: string;
  name: string;
  cityCode: string;
  provinceCode: string;
}

interface AddressOptionsChildren {
  label: string;
  value: string;
  children?: AddressOptionsChildren[];
}

(areas as AreasOptions[]).forEach((area) => {
  const matchCity = (cities as CitiesOptions[]).filter((city) => city.code === area.cityCode)[0];
  if (matchCity) {
    matchCity.children = matchCity.children || [];
    matchCity.children.push({
      label: area.name,
      value: area.name,
    });
  }
});

(cities as CitiesOptions[]).forEach((city) => {
  const matchProvince = (provinces as ProvincesOptions[]).filter(
    (province) => province.code === city.provinceCode,
  )[0];
  if (matchProvince) {
    matchProvince.children = matchProvince.children || [];
    matchProvince.children.push({
      label: city.name,
      value: city.name,
      children: city.children,
    });
  }
});

const options = (provinces as ProvincesOptions[]).map((province) => ({
  label: province.name,
  value: province.name,
  children: province.children,
}));

export default options;
