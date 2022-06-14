/*
 * @Author: zhangchenyang
 * @Date: 2022-06-13 14:16:45
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-06-13 18:29:45
 */
import React from "react";
import { observer } from "mobx-react";
import { Button, Typography } from "antd";

import DI from "../../inversify.config";
import style from "./style.less";
import DemoViewModel from "./viewmodel";
import { DEMO_IDENTIFIER } from "../../constants/identifiers";
import AntDesignProDemo from "../../common/components/antDesignPro/index";

const { Title } = Typography;

const viewmodel = DI.DIContainer.get<
  DemoViewModel
>(DEMO_IDENTIFIER.DEMO_VIEW_MODEL);

export default observer(() => {
  const { count, setCount, getSomething, exampleInfo } = viewmodel

  return (
    <div className={style.container}>
      <Title className={style.sectionTitle} level={2}>
        counter
      </Title>
      <section className={style.counterWrapper}>
        <span className={style.content}>{count}</span>
        <Button className={style.countBtn} onClick={(): void => setCount()}>
          add+
        </Button>
      </section>
      <Title className={style.sectionTitle} level={2}>
        simple request
      </Title>
      <section className={style.counterWrapper}>
        <Button
          className={style.countBtn}
          onClick={(): Promise<void> => getSomething()}
        >
          get something
        </Button>
      </section>
      <div>
        {exampleInfo.map((ele, index) => (
          <div key={`${ele.headers?.Accept}_${index}`}>
            <div>URL: {ele.url}</div>
            <div>ORIGIN: {ele.origin}</div>
            <div>HOST: {ele.headers?.Host}</div>
            <hr />
          </div>
        ))}
      </div>
      <Title className={style.sectionTitle} level={2}>
        ant design pro
      </Title>
      <section className={style.counterWrapper}>
        <AntDesignProDemo />
      </section>
    </div>
  );
});
