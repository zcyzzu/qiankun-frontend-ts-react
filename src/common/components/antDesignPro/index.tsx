/*
 * @Author: zhangchenyang
 * @Date: 2022-06-13 14:16:45
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-06-13 18:31:26
 */
import React from "react";
import { observer } from "mobx-react";
import { ProForm, ProFormText } from "@ant-design/pro-components";

import style from "./style.less";

export default observer(() => {
  return (
    <div className={style.container}>
      <ProForm
        onFinish={async (values) => {
          window.alert(values.name);
        }}
      >
        <ProFormText name="name" label="姓名" />
      </ProForm>
    </div>
  );
});
