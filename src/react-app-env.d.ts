/*
 * @Author: derek.chia
 * @Date: 2021-06-23 11:30:15
 * @LastEditTime: 2022-05-05 14:53:42
 * @LastEditors: zhangchenyang
 * @Description:
 * @FilePath: /demo-frontend/src/react-app-env.d.ts
 */
/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test";
    readonly PUBLIC_URL: string;
  }
}

declare module "*.bmp" {
  const src: string;
  export default src;
}

declare module "*.gif" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  import * as React from "react";

  export const ReactComponent: React.FunctionComponent<React.SVGProps<
    SVGSVGElement
  > & {
    title?: string;
  }>;

  const src: string;
  export default src;
}

declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.module.scss" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.module.sass" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.less" {
  const less: { readonly [key: string]: string };
  export default less;
}

declare module "*.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
