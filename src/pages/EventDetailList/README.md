# EventDetailList 页面

## 功能描述

事件详情列表页面，用于管理事件详情的基本信息。

## 主要功能

- 事件详情列表展示
- 事件详情新增
- 事件详情编辑
- 事件详情删除
- 事件详情查看
- 事件详情搜索

## 组件结构

```
EventDetailList/
├── index.tsx              # 主页面组件
├── index.less            # 页面样式
├── types.d.ts            # 类型定义
├── helper.ts             # 辅助函数
├── components/           # 子组件
│   ├── index.ts
│   ├── EventDetailForm.tsx
│   ├── EventDetailTable.tsx
│   ├── EventDetailModal.tsx
│   └── EventDetailViewModal.tsx
└── hooks/                # 自定义 Hooks
    └── useEventDetailList.ts
```

## 使用说明

1. 点击"新建"按钮可以创建新事件详情
2. 双击表格行可以查看事件详情
3. 使用搜索功能可以快速查找事件详情
4. 支持编辑和删除操作

## 字段说明

- **事件流水号**: 事件的流水号
- **事件编号**: 事件的编号
- **事件类型**: 事件的类型分类
- **事件来源**: 事件的来源系统
- **事件内容**: 事件的详细内容
- **事件时间**: 事件发生的时间
- **处理状态**: 事件的处理状态
- **处理结果**: 事件的处理结果
- **拒绝码**: 如果被拒绝，显示拒绝码
- **处理时间**: 事件处理耗时
- **重试次数**: 事件重试的次数
- **结果内容**: 处理结果的详细内容
- **错误信息**: 如果处理失败，显示错误信息

## API 接口

- `queryEventDetails` - 查询事件详情列表
- `createEventDetail` - 创建事件详情
- `updateEventDetail` - 更新事件详情
- `deleteEventDetail` - 删除事件详情

