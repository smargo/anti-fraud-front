# SystemDictList 页面

## 功能描述

系统字典列表页面，用于管理系统字典的基本信息。

## 主要功能

- 字典列表展示
- 字典新增
- 字典编辑
- 字典删除
- 字典查看
- 字典搜索

## 组件结构

```
SystemDictList/
├── index.tsx              # 主页面组件
├── index.less            # 页面样式
├── types.d.ts            # 类型定义
├── helper.ts             # 辅助函数
├── components/           # 子组件
│   ├── index.ts
│   ├── SystemDictForm.tsx
│   ├── SystemDictTable.tsx
│   ├── SystemDictModal.tsx
│   └── SystemDictViewModal.tsx
└── hooks/                # 自定义 Hooks
    └── useSystemDictList.ts
```

## 使用说明

1. 点击"新建"按钮可以创建新字典
2. 双击表格行可以查看字典详情
3. 使用搜索功能可以快速查找字典
4. 支持编辑和删除操作

## 字段说明

- **代码编号**: 字典的分类编号
- **代码项编号**: 字典项的唯一标识
- **代码项值**: 字典项的实际值
- **代码描述**: 字典项的详细描述
- **排序编号**: 用于排序的数值
- **状态**: 是否启用该字典项

## API 接口

- `querySystemDicts` - 查询字典列表
- `createSystemDict` - 创建字典
- `updateSystemDict` - 更新字典
- `deleteSystemDict` - 删除字典

