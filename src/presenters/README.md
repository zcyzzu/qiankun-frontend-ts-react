presenters文件夹是项目中的用户界面逻辑，状态, 也就是具体页面的逻辑

我们使用react class components的写法描述整个页面

在页面的viewmodel中我们采用mobx5 装饰器 的写法 定义了 该页面用到的 变量与方法

其中rootcontainer是我们所有页面的根页面 在这里 我们可以进行 为页面统一添加 loading 、数据为空时的样式等操作  