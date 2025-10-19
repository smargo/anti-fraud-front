# EventList 页面

## 功能描述

事件列表页面，用于管理反欺诈事件的基本信息。

## 主要功能

- 事件列表展示
- 事件新增
- 事件编辑
- 事件删除
- 事件查看
- 事件搜索

## 组件结构

```
EventList/
├── index.tsx          # 主页面组件
├── index.less        # 页面样式
├── types.d.ts        # 类型定义
├── helper.ts         # 辅助函数
├── components/       # 子组件
│   ├── index.ts
│   ├── EventForm.tsx
│   ├── EventTable.tsx
│   └── EventModal.tsx
└── hooks/           # 自定义 Hooks
    └── useEventList.ts
```

## 使用说明

1. 点击"新建"按钮可以创建新事件
2. 点击事件编号可以跳转到事件配置页面
3. 双击表格行可以查看事件详情
4. 使用搜索功能可以快速查找事件
5. 支持编辑和删除操作

## API 接口

- `queryEvents` - 查询事件列表
- `createEvent` - 创建事件
- `updateEventBasicInfo` - 更新事件基本信息
- `deleteEvent` - 删除事件

