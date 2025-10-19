# EventConfig 页面

## 功能描述

事件配置页面，用于管理反欺诈事件的详细配置信息，包括版本控制、基础信息、字段配置等。

## 主要功能

- 版本控制管理
- 基础信息配置
- 字段配置管理
- 衍生字段配置
- 阶段配置管理
- 事件指标配置
- 语句依赖管理

## 组件结构

```
EventConfig/
├── index.tsx              # 主页面组件
├── index.less            # 页面样式
├── types.d.ts            # 类型定义
├── constants.ts          # 常量定义
├── helper.ts             # 辅助函数
├── components/           # 子组件
│   ├── index.ts
│   ├── VersionControl.tsx
│   ├── BasicInfoTab.tsx
│   ├── FieldConfigTab.tsx
│   ├── DeriveFieldTab.tsx
│   ├── StageConfigTab.tsx
│   ├── EventIndicatorTab.tsx
│   ├── StatementDependencyTab.tsx
│   └── ...其他组件
├── hooks/                # 自定义 Hooks
└── utils/                # 工具函数
```

## 使用说明

1. 通过 URL 参数 `eventNo` 进入页面
2. 在版本控制面板中选择要编辑的版本
3. 在各个标签页中配置相应的信息
4. 支持版本创建、激活、历史查看等功能

## 版本管理

- **草稿版本**: 可以编辑和修改
- **生效版本**: 只读状态，不能修改
- **已审批版本**: 只读状态
- **已归档版本**: 只读状态

## API 接口

- `getEventByEventNo` - 获取事件详情
- `getVersionInfo` - 获取版本信息
- `createVersion` - 创建新版本
- `activateVersion` - 激活版本
- `updateEventBasicInfo` - 更新事件基础信息

