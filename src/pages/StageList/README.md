# StageList 页面

## 功能描述

阶段列表页面，用于管理事件阶段的基本信息。

## 主要功能

- 阶段列表展示
- 阶段新增
- 阶段编辑
- 阶段删除
- 阶段查看
- 阶段搜索

## 组件结构

```
StageList/
├── index.tsx              # 主页面组件
├── index.less            # 页面样式
├── types.d.ts            # 类型定义
├── helper.ts             # 辅助函数
├── components/           # 子组件
│   ├── index.ts
│   ├── StageForm.tsx
│   ├── StageTable.tsx
│   ├── StageModal.tsx
│   └── StageViewModal.tsx
└── hooks/                # 自定义 Hooks
    └── useStageList.ts
```

## 使用说明

1. 点击"新建"按钮可以创建新阶段
2. 双击表格行可以查看阶段详情
3. 使用搜索功能可以快速查找阶段
4. 支持编辑和删除操作

## 字段说明

- **事件编号**: 关联的事件编号
- **版本编号**: 关联的版本编号
- **阶段编号**: 阶段的唯一标识
- **阶段名称**: 阶段的显示名称
- **阶段Bean**: 阶段处理Bean
- **阶段参数**: 阶段处理参数

## API 接口

- `stageApi.query` - 查询阶段列表
- `stageApi.create` - 创建阶段
- `stageApi.update` - 更新阶段
- `stageApi.delete` - 删除阶段

