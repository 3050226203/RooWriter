# 变更日志：CodeIndexManager 移除与 System Prompt 更新

**日期**: 2025-12-01
**类型**: 架构调整 / 瘦身
**WBS 任务**: 4.1 LightRAG MCP 集成 - [瘦身] & [新增]

## 1. 变更概述

为了减轻插件体积、降低运行时资源消耗，并转向完全依赖 MCP (Model Context Protocol) 进行知识检索，本次更新彻底移除了客户端本地的 `CodeIndexManager` 及其相关依赖（Qdrant, Embedder, FileWatcher）。同时，更新了 System Prompt 以引导模型在需要时调用外部的 LightRAG MCP 工具。

## 2. System Prompt 更新详情

### 2.1 规则部分 (`src/core/prompts/sections/rules.ts`)

针对写作模式（writer, editor, researcher, publisher），添加了明确的知识检索指引，引导模型优先使用 `query_knowledge_base` 工具。

**变更内容**:

```typescript
// ... inside getRulesSection ...
if (isWritingMode) {
	return `${baseRules}
// ...
- **KNOWLEDGE RETRIEVAL**: If you need background information or context that might be in the knowledge base, use the 'query_knowledge_base' MCP tool (if available).
// ...
`
}
```

### 2.2 工具定义与过滤 (`src/core/prompts/tools/index.ts` & `filter-tools-for-mode.ts`)

- **移除 `codebase_search`**: 从所有模式的可用工具列表中强制移除了 `codebase_search`。
- **逻辑更新**:
    - `getToolDescriptionsForMode`: 删除了 `codebase_search` 的描述生成逻辑。
    - `filterNativeToolsForMode`: 删除了依赖 `CodeIndexManager` 状态来启用/禁用 `codebase_search` 的逻辑，改为直接禁用。

### 2.3 目标部分 (`src/core/prompts/sections/objective.ts`)

移除了关于“在探索代码前必须先使用 codebase_search”的强制性指令，使目标描述更加通用且专注于当前可用的工具。

**移除内容**:

> "First, for ANY exploration of code you haven't examined yet in this conversation, you MUST use the `codebase_search` tool..."

### 2.4 系统提示生成 (`src/core/prompts/system.ts`)

- 移除了 `CodeIndexManager` 的实例化代码。
- 不再将 `codeIndexManager` 实例传递给各个 Prompt 生成函数（如 `getToolUseGuidelinesSection`, `getCapabilitiesSection` 等）。

## 3. 代码库清理详情

### 3.1 移除的核心组件 (src)

- **目录删除**: `src/services/code-index/` (包含 Embedder, VectorStore, FileWatcher, Orchestrator 等)。
- **文件删除**:
    - `src/core/tools/CodebaseSearchTool.ts`
    - `src/core/prompts/tools/codebase-search.ts`
    - `src/core/prompts/tools/native-tools/codebase_search.ts`

### 3.2 扩展激活逻辑清理 (`extension.ts` & `ClineProvider.ts`)

- 移除了 `CodeIndexManager` 的初始化、事件订阅和后台索引启动逻辑。
- 移除了 `updateCodeIndexStatusSubscription` 相关调用。
- 移除了 `webviewMessageHandler.ts` 中处理索引设置、状态查询、启动索引等 6 个消息类型的处理逻辑。

### 3.3 前端 UI 清理 (webview-ui)

- **组件删除**:
    - `webview-ui/src/components/chat/CodeIndexPopover.tsx`
    - `webview-ui/src/components/chat/IndexingStatusBadge.tsx`
- **界面调整**: `ChatTextArea.tsx` 不再渲染索引状态图标。

### 3.4 类型定义清理 (packages/types)

- **文件删除**: `packages/types/src/codebase-index.ts`
- **配置清理**: `global-settings.ts` 中移除了 `codebaseIndexModels`、`codebaseIndexConfig` 以及相关的 API Key 字段（如 `codeIndexOpenAiKey`, `codeIndexQdrantApiKey` 等）。

## 4. 后续行动

- **手动配置**: 用户需手动在 `.roo/mcp.json` 中配置 LightRAG MCP Server 的连接信息。
- **验证**: 启动插件后，验证 System Prompt 是否正确生成，且不再尝试连接本地 Qdrant 或执行本地索引。
