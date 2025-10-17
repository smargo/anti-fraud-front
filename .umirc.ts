import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '反欺诈系统',
  },
  routes: [
    { path: '/', redirect: '/event/list', },
    { 
      path: '/event', 
      name: '事件管理', 
      icon: 'NotificationOutlined',
      routes: [
        { path: '/event/list', name: '事件列表', component: './EventList', },
        { path: '/event/detail/:eventNo', name: '事件详情', component: './EventDetail', hideInMenu: true, },
        { path: '/event/detail-list', name: '事件明细', component: './EventDetailList', },
        { path: '/event/version-list', name: '事件版本', component: './EventVersionList', },
        { path: '/event/config', name: '事件配置', component: './EventConfig', hideInMenu: true, },
      ],
    },
    {
      path: '/field',
      name: '字段管理',
      icon: 'FieldBinaryOutlined',
      routes: [
        { path: '/field/list', name: '事件字段', component: './FieldList', },
        { path: '/field/derive/list', name: '衍生字段', component: './DeriveFieldList', },
      ],
    },
    {
      path: '/stage',
      name: '阶段管理',
      icon: 'DeploymentUnitOutlined',
      routes: [
        { path: '/stage/list', name: '阶段', component: './StageList', },
      ],
    },
    {
      path: '/statement',
      name: '语句管理',
      icon: 'DeploymentUnitOutlined',
      routes: [
        { path: '/statement/list', name: '处理语句', component: './StatementList', },
        { path: '/statement/dependency/list', name: '语句依赖', component: './StatementDependencyList', },
      ],
    },
    {
      path: '/indicator',
      name: '指标管理',
      icon: 'BarChartOutlined',
      routes: [
        { path: '/indicator/list', name: '指标列表', component: './IndicatorList', },
        { path: '/indicator/relation/list', name: '事件指标关联', component: './EventIndicatorList', },
      ],
    },
    {
      path: '/datasource',
      name: '数据源管理',
      icon: 'DatabaseOutlined',
      routes: [
        { path: '/datasource/list', name: '数据源配置', component: './DataSourceList', },
      ],
    },
    {
      path: '/dict',
      name: '字典配置管理',
      icon: 'DatabaseOutlined',
      routes: [
        { path: '/dict/list', name: '字典配置', component: './SystemDictList', },
      ],
    },
  ],
  npmClient: 'npm',
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
});