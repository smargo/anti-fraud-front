# EventIndicatorList 页面

## 功能描述

事件指标列表页面，用于管理事件指标的基本信息。

## 主要功能

- 事件指标列表展示
- 事件指标新增
- 事件指标编辑
- 事件指标删除
- 事件指标查看
- 事件指标搜索

## 组件结构

```
EventIndicatorList/
├── index.tsx              # 主页面组件
├── index.less            # 页面样式
├── types.d.ts            # 类型定义
├── helper.ts             # 辅助函数
├── components/           # 子组件
│   ├── index.ts
│   ├── EventIndicatorForm.tsx
│   ├── EventIndicatorTable.tsx
│   ├── EventIndicatorModal.tsx
│   └── EventIndicatorViewModal.tsx
└── hooks/                # 自定义 Hooks
    └── useEventIndicatorList.ts
```

## 使用说明

1. 点击"新建"按钮可以创建新事件指标
2. 双击表格行可以查看事件指标详情
3. 使用搜索功能可以快速查找事件指标
4. 支持编辑和删除操作

## 字段说明

- **事件编号**: 关联的事件编号
- **版本编号**: 关联的版本编号
- **指标名称**: 指标的显示名称
- **指标类型**: 指标的数据类型
- **指标描述**: 指标的详细描述
- **指标公式**: 指标的计算公式

## API 接口

- `queryEventIndicators` - 查询事件指标列表
- `createEventIndicator` - 创建事件指标
- `updateEventIndicator` - 更新事件指标
- `deleteEventIndicator` - 删除事件指标

