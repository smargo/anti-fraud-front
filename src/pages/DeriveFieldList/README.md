# DeriveFieldList 页面

## 功能描述

衍生字段列表页面，用于管理事件衍生字段的基本信息。

## 主要功能

- 衍生字段列表展示
- 衍生字段新增
- 衍生字段编辑
- 衍生字段删除
- 衍生字段查看
- 衍生字段搜索

## 组件结构

```
DeriveFieldList/
├── index.tsx              # 主页面组件
├── index.less            # 页面样式
├── types.d.ts            # 类型定义
├── helper.ts             # 辅助函数
├── components/           # 子组件
│   ├── index.ts
│   ├── DeriveFieldForm.tsx
│   ├── DeriveFieldTable.tsx
│   ├── DeriveFieldModal.tsx
│   └── DeriveFieldViewModal.tsx
└── hooks/                # 自定义 Hooks
    └── useDeriveFieldList.ts
```

## 使用说明

1. 点击"新建"按钮可以创建新衍生字段
2. 双击表格行可以查看衍生字段详情
3. 使用搜索功能可以快速查找衍生字段
4. 支持编辑和删除操作

## 字段说明

- **事件编号**: 关联的事件编号
- **版本编号**: 关联的版本编号
- **字段名称**: 衍生字段的显示名称
- **字段类型**: 衍生字段的数据类型
- **字段描述**: 衍生字段的详细描述
- **处理类型**: 字段处理的方式类型
- **处理Bean**: 字段处理的Bean名称
- **处理脚本**: 字段处理的脚本代码

## API 接口

- `queryDeriveFields` - 查询衍生字段列表
- `createDeriveField` - 创建衍生字段
- `updateDeriveField` - 更新衍生字段
- `deleteDeriveField` - 删除衍生字段

