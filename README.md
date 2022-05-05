## qiankun-frontend

### 项目介绍

前端工程，主要技术栈：**React, typescript, ant design, inversify js, mobx, axios, less**    


### 配置文件

`src/common/config/configProvider.ts`

#### ENV



### 本地开发

```
npm install

npm run start
```
如果token过期，直接退出登录后重新登陆即可

### 项目结构介绍

    |-- charts
    |-- config                          // webpack配置
    |-- docker                          // 镜像配置文件及shell脚本
    |-- public
    |-- scripts
    |-- src
        |-- assets                      // 项目静态资源
            |-- images                  // 图片
            |-- mock                    // mock数据
        |-- common
            |-- components              // 公共组件
            |-- config                  // 公共配置
            |-- styles                  // 公共样式
        |-- constants                   // 定义的常量及identifiers
        |-- data                        // data层（repository的具体实现）
        |-- domain                      // domain层
            |-- entities                // 业务实体
            |-- repositories            // 定义如何访问实体
            |-- useCases                // 实体层业务逻辑
        |-- presenters                  // view层（每个目录对应左侧菜单的一个模块）
            |-- Index.tsx               // 页面具体的view层代码
            |-- Style.less              // 样式
            |-- ViewModel.ts            // 定义viewmodel的interface
            |-- ViewModelImpl.ts        // viewmodel的实现
        |-- utils                       // utils方法及axios拦截器
        |-- Global.less                 // 全局样式
        |-- GlobalDefinitions.ts        // 定义window变量
        |-- index.tsx                   // 入口文件
        |-- publicPath.js
        |-- react-app-env.d.ts
        |-- routes.tsx                  // 路由配置
        |-- serviceWorker.ts
    |-- .eslintignore
    |-- .eslintrc.js                    
    |-- .gitignore
    |-- .gitlab-ci.yml
    |-- .prettierrc.js                  // prettier配置
    |-- package-lock.json
    |-- package.json
    |-- settings.json
    |-- tsconfig.json
    |-- yarn.lock

### 代码部署（需要有对应的权限）
推送代码后等待gitlab CI pipeline跑完，在devops开发平台-->应用部署-->资源-->选择对应环境下面的tmis前端-->变更实例，在选择版本下拉框选择对应开发分支及刚跑完的pipeline编号，确认无误后点击变更即可。

### 相关文档
- [the clean architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) 
- [the clean architecture using react and typescript](https://medium.com/@rostislavdugin/the-clean-architecture-using-react-and-typescript-a832662af803) 
- [react](https://zh-hans.reactjs.org/tutorial/tutorial.html) 
- [typescript](https://www.typescriptlang.org/docs/) 
- [InversifyJS](https://github.com/inversify/InversifyJS) 
- [mobx](https://cn.mobx.js.org/) 
- [axios](https://axios-http.com/docs/intro) 
- [ant design](https://ant.design/docs/react/introduce-cn) 
- [less](https://less.bootcss.com/) 

## License


    
        