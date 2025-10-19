# FieldList 页面

## 功能描述

字段列表页面，用于管理事件字段的基本信息。

## 主要功能

- 字段列表展示
- 字段新增
- 字段编辑
- 字段删除
- 字段查看
- 字段搜索

## 组件结构

```
FieldList/
├── index.tsx              # 主页面组件
├── index.less            # 页面样式
├── types.d.ts            # 类型定义
├── helper.ts             # 辅助函数
├── components/           # 子组件
│   ├── index.ts
│   ├── FieldForm.tsx
│   ├── FieldTable.tsx
│   ├── FieldModal.tsx
│   └── FieldViewModal.tsx
└── hooks/                # 自定义 Hooks
    └── useFieldList.ts
```

## 使用说明

1. 点击"新建"按钮可以创建新字段
2. 双击表格行可以查看字段详情
3. 使用搜索功能可以快速查找字段
4. 支持编辑和删除操作

## 字段说明

- **事件编号**: 关联的事件编号
- **版本编号**: 关联的版本编号
- **字段名称**: 字段的显示名称
- **字段类型**: 字段的数据类型
- **字段描述**: 字段的详细描述
- **验证脚本**: 字段验证的脚本代码

## API 接口

- `fieldApi.query` - 查询字段列表
- `fieldApi.create` - 创建字段
- `fieldApi.update` - 更新字段
- `fieldApi.delete` - 删除字段

