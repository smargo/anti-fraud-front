// https://umijs.org/config/
import { defineConfig } from '@umijs/max';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

const { REACT_APP_ENV = 'dev' } = process.env;

export default defineConfig({
  /**
   * @name 开启 hash 模式
   * @description 让 build 之后的产物包含 hash 后缀。通常用于增量发布和避免浏览器加载缓存。
   * @doc https://umijs.org/docs/api/config#hash
   */
  hash: true,

  /**
   * @name 路由的配置，不在路由中引入的文件不会编译
   * @description 只支持 path，component，routes，redirect，wrappers，title 的配置
   * @doc https://umijs.org/docs/guides/routes
   */
  routes,

  /**
   * @name 主题的配置
   * @description 虽然叫主题，但是其实只是 less 的变量设置
   * @doc antd的主题设置 https://ant.design/docs/react/customize-theme-cn
   * @doc umi 的theme 配置 https://umijs.org/docs/api/config#theme
   */
  theme: {
    // 如果不想要 configProvide 动态设置主题需要把这个设置为 default
    // 只有设置为 variable， 才能使用 configProvide 动态设置主色调
    'root-entry-name': 'variable',
  },

  /**
   * @name moment 的国际化配置
   * @description 如果对国际化没有要求，打开之后能减少js的包大小
   * @doc https://umijs.org/docs/api/config#ignoremomentlocale
   */
  ignoreMomentLocale: true,

  /**
   * @name 代理配置
   * @description 可以让你的本地服务器代理到你的服务器上，这样你就可以访问服务器的数据了
   * @see 要注意以下 代理只能在本地开发时使用，build 之后就无法使用了。
   * @doc 代理介绍 https://umijs.org/docs/guides/proxy
   * @doc 代理配置 https://umijs.org/docs/api/config#proxy
   */
  proxy: proxy[REACT_APP_ENV as keyof typeof proxy],

  /**
   * @name 快速热更新配置
   * @description 一个不错的热更新组件，更新时可以保留 state
   */
  fastRefresh: false,

  /**
   * @name 应用标题
   */
  title: '反欺诈系统',

  /**
   * @name <head> 中额外的 script
   * @description 配置 <head> 中额外的 script
   */
  headScripts: [
    // 解决首次加载时白屏的问题
    {
      src: '/scripts/loading.js',
      async: true,
    },
  ],

  /**
   * @name 历史模式
   */
  history: {
    type: 'browser',
  },

  /**
   * @name 全局变量定义
   */
  define: {
    APP_CODE: 'antifraud',
    API_SERVER: '/api',
  },

  /**
   * @name 数据流插件
   * @description 基于 dva 的数据流
   */
  dva: {},

  /**
   * @name 权限插件
   * @description 基于 initialState 的权限管理
   */
  access: {},

  /**
   * @name 布局插件
   * @description 启用 ProLayout
   */
  layout: {
    locale: false,
    ...defaultSettings,
  },

  /**
   * @name 请求插件
   * @description 基于 umi-request 和 umi-hooks 的请求方案
   */
  request: {
    dataField: 'data',
  },

  /**
   * @name 初始状态插件
   * @description 基于 useModel 的全局状态管理
   */
  initialState: {},

  /**
   * @name 模型插件
   * @description 基于 useModel 的全局状态管理
   */
  model: {},

  /**
   * @name antd 插件
   * @description 启用 antd
   */
  antd: {
    // 开启暗色主题
    dark: false,
    // 开启紧凑主题
    compact: false,
  },

  /**
   * @name moment 转 dayjs
   * @description 用 dayjs 替换 moment，减少打包体积
   */
  moment2dayjs: {
    preset: 'antd',
    plugins: ['duration'],
  },

  /**
   * @name qiankun 微前端配置
   * @description 配置微前端子应用
   */
  qiankun: {
    slave: {},
  },

  /**
   * @name 预设
   */
  presets: ['umi-presets-pro'],

  /**
   * @name 基础路径
   */
  base: '/microApp/antifraud',
  publicPath: '/',

  /**
   * @name 开发工具配置
   */
  esbuildMinifyIIFE: true,

  /**
   * @name MFSU 配置
   * @description 模块联邦和缓存优化 - 暂时禁用以解决构建问题
   */
  mfsu: false,
});
