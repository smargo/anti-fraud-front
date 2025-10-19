# StatementDependencyList 页面

## 功能描述

语句依赖列表页面，用于管理事件语句依赖的基本信息。

## 主要功能

- 语句依赖列表展示
- 语句依赖新增
- 语句依赖编辑
- 语句依赖删除
- 语句依赖查看
- 语句依赖搜索

## 组件结构

```
StatementDependencyList/
├── index.tsx              # 主页面组件
├── index.less            # 页面样式
├── types.d.ts            # 类型定义
├── helper.ts             # 辅助函数
├── components/           # 子组件
│   ├── index.ts
│   ├── StatementDependencyForm.tsx
│   ├── StatementDependencyTable.tsx
│   ├── StatementDependencyModal.tsx
│   └── StatementDependencyViewModal.tsx
└── hooks/                # 自定义 Hooks
    └── useStatementDependencyList.ts
```

## 使用说明

1. 点击"新建"按钮可以创建新语句依赖
2. 双击表格行可以查看语句依赖详情
3. 使用搜索功能可以快速查找语句依赖
4. 支持编辑和删除操作

## 字段说明

- **事件编号**: 关联的事件编号
- **版本编号**: 关联的版本编号
- **依赖编号**: 依赖的唯一标识
- **依赖名称**: 依赖的显示名称
- **依赖类型**: 依赖的类型分类
- **依赖描述**: 依赖的详细描述
- **依赖内容**: 依赖的具体内容

## API 接口

- `queryStatementDependencies` - 查询语句依赖列表
- `createStatementDependency` - 创建语句依赖
- `updateStatementDependency` - 更新语句依赖
- `deleteStatementDependency` - 删除语句依赖

