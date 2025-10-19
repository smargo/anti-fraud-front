# IndicatorList 页面

## 功能描述

指标列表页面，用于管理指标的基本信息。

## 主要功能

- 指标列表展示
- 指标新增
- 指标编辑
- 指标删除
- 指标查看
- 指标搜索

## 组件结构

```
IndicatorList/
├── index.tsx              # 主页面组件
├── index.less            # 页面样式
├── types.d.ts            # 类型定义
├── helper.ts             # 辅助函数
├── components/           # 子组件
│   ├── index.ts
│   ├── IndicatorForm.tsx
│   ├── IndicatorTable.tsx
│   ├── IndicatorModal.tsx
│   └── IndicatorViewModal.tsx
└── hooks/                # 自定义 Hooks
    └── useIndicatorList.ts
```

## 使用说明

1. 点击"新建"按钮可以创建新指标
2. 双击表格行可以查看指标详情
3. 使用搜索功能可以快速查找指标
4. 支持编辑和删除操作

## 字段说明

- **指标编号**: 指标的唯一标识
- **指标名称**: 指标的显示名称
- **指标描述**: 指标的详细描述
- **查询编号**: 关联的查询编号
- **查询字段**: 查询中使用的字段

## API 接口

- `indicatorApi.query` - 查询指标列表
- `indicatorApi.create` - 创建指标
- `indicatorApi.update` - 更新指标
- `indicatorApi.delete` - 删除指标

