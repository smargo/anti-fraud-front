# DataSourceList 页面

## 功能描述

数据源列表页面，用于管理数据源的基本信息。

## 主要功能

- 数据源列表展示
- 数据源新增
- 数据源编辑
- 数据源删除
- 数据源查看
- 数据源搜索

## 组件结构

```
DataSourceList/
├── index.tsx              # 主页面组件
├── index.less            # 页面样式
├── types.d.ts            # 类型定义
├── helper.ts             # 辅助函数
├── components/           # 子组件
│   ├── index.ts
│   ├── DataSourceForm.tsx
│   ├── DataSourceTable.tsx
│   ├── DataSourceModal.tsx
│   └── DataSourceViewModal.tsx
└── hooks/                # 自定义 Hooks
    └── useDataSourceList.ts
```

## 使用说明

1. 点击"新建"按钮可以创建新数据源
2. 双击表格行可以查看数据源详情
3. 使用搜索功能可以快速查找数据源
4. 支持编辑和删除操作

## 字段说明

- **数据源编号**: 数据源的唯一标识
- **数据源名称**: 数据源的显示名称
- **数据源类型**: 数据库类型（MySQL、Oracle、PostgreSQL等）
- **用户名**: 数据库连接用户名
- **密码**: 数据库连接密码
- **连接字符串**: 数据库连接字符串
- **数据源参数**: 额外的连接参数

## API 接口

- `dataSourceApi.query` - 查询数据源列表
- `dataSourceApi.create` - 创建数据源
- `dataSourceApi.update` - 更新数据源
- `dataSourceApi.delete` - 删除数据源

