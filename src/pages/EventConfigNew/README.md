# EventConfig 页面重构

## 📋 概述

EventConfig 页面重构项目，将原本3500+行的巨型组件拆分成多个独立、可维护的小组件。

## 🏗️ 架构设计

### 目录结构

```
EventConfigNew/
├── index.tsx                    # 主页面容器
├── components/                  # 组件目录
│   ├── VersionControl/          # 版本控制组件
│   │   ├── index.tsx
│   │   ├── VersionHistoryModal.tsx
│   │   ├── CreateVersionModal.tsx
│   │   └── CopyVersionModal.tsx
│   ├── BasicInfoTab/           # 基础信息Tab
│   │   └── index.tsx
│   ├── FieldConfigTab/         # 字段配置Tab
│   │   ├── index.tsx
│   │   ├── FieldModal.tsx
│   │   └── FieldViewModal.tsx
│   └── index.ts                # 组件导出
├── hooks/                      # 自定义Hooks
│   ├── useEventConfig.ts       # 主页面状态管理
│   ├── useVersionControl.ts    # 版本控制逻辑
│   └── useFieldConfig.ts       # 字段配置逻辑
├── services/                   # API服务
│   ├── eventConfigApi.ts       # 事件配置相关API
│   ├── fieldConfigApi.ts       # 字段配置API
│   ├── deriveFieldConfigApi.ts # 衍生字段API
│   ├── stageConfigApi.ts       # 阶段配置API
│   ├── eventIndicatorConfigApi.ts # 事件指标API
│   └── statementDependencyConfigApi.ts # 语句依赖API
├── types/                      # 类型定义
│   ├── index.ts               # 主类型定义
│   ├── fieldTypes.ts          # 字段相关类型
│   ├── deriveFieldTypes.ts    # 衍生字段类型
│   ├── stageTypes.ts          # 阶段类型
│   ├── eventIndicatorTypes.ts # 事件指标类型
│   └── statementDependencyTypes.ts # 语句依赖类型
├── utils/                      # 工具函数
│   └── index.ts               # 工具函数
├── constants.ts               # 常量定义
├── index.less                 # 样式文件
└── README.md                  # 说明文档
```

### 组件拆分策略

1. **主页面容器 (index.tsx)**
   - 负责整体布局和Tab切换
   - 管理全局状态（事件信息、版本信息）
   - 处理URL参数和路由逻辑
   - 协调各个Tab组件之间的数据传递

2. **版本控制组件 (VersionControl/)**
   - 版本历史管理
   - 版本创建和复制
   - 版本状态切换
   - 草稿保存逻辑

3. **各个Tab组件**
   - 每个Tab独立成组件
   - 包含完整的CRUD功能
   - 独立的状态管理
   - 独立的API调用逻辑

### 状态管理策略

- **全局状态**: 使用 `useEventConfig` Hook管理事件基本信息、版本信息等
- **各Tab独立状态**: 每个Tab使用独立的Hook管理状态
- **跨组件通信**: 通过props传递必要的全局状态

### API服务拆分

- 按功能模块拆分API服务
- 统一的错误处理和响应格式
- 统一的loading状态管理

## 🚀 实施进度

### ✅ 已完成

1. **基础架构**
   - [x] 创建目录结构
   - [x] 拆分类型定义
   - [x] 创建基础Hook和API服务
   - [x] 实现主页面容器

2. **版本控制**
   - [x] 实现版本控制组件
   - [x] 实现版本管理逻辑
   - [x] 集成到主页面

3. **Tab组件**
   - [x] 基础信息Tab（最简单）
   - [x] 字段配置Tab

### 🔄 待完成

1. **Tab组件**
   - [ ] 衍生字段Tab
   - [ ] 阶段配置Tab
   - [ ] 事件指标Tab
   - [ ] 语句依赖Tab

2. **优化和测试**
   - [ ] 性能优化
   - [ ] 错误处理完善
   - [ ] 单元测试
   - [ ] 集成测试

## 🛠️ 技术要点

### 组件通信
- 使用Context API进行跨组件通信
- Props drilling最小化
- 事件回调处理跨Tab操作

### 性能优化
- 使用React.memo优化渲染
- 使用useMemo和useCallback优化计算
- 懒加载Tab内容

### 错误处理
- 统一的错误边界
- 各模块独立的错误处理
- 用户友好的错误提示

### 代码复用
- 提取公共组件（Table、Modal、Form等）
- 统一的验证规则
- 公共的工具函数

## 📝 使用说明

### 开发新Tab组件

1. 在 `components/` 下创建新的Tab目录
2. 在 `hooks/` 下创建对应的Hook
3. 在 `services/` 下创建对应的API服务
4. 在 `types/` 下添加对应的类型定义
5. 在主页面中集成新Tab

### 添加新的API服务

1. 在 `services/` 下创建新的API文件
2. 定义统一的响应格式
3. 添加错误处理逻辑
4. 在对应的Hook中使用

## 🔧 开发规范

1. **组件命名**: 使用PascalCase，文件名与组件名一致
2. **Hook命名**: 使用use开头，描述性强
3. **类型定义**: 接口使用I开头，类型使用T开头
4. **文件组织**: 按功能模块组织，避免过深的嵌套
5. **代码注释**: 关键逻辑添加注释，复杂组件添加文档

## 📈 后续计划

1. 完成剩余Tab组件的实现
2. 添加单元测试和集成测试
3. 性能优化和代码审查
4. 文档完善和最佳实践总结
