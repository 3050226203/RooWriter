# RooWriter 改造项目任务分解 (WBS)

## 1. 阶段一：核心模式与基础迁移 (Core Modes & Basic Migration)
目标：建立写作专属的模式体系，限制工具范围，移除干扰性的代码功能。

- [x] **1.1 定义写作模式 (src/shared/modes.ts)**
    - [x] 创建 `writer` 模式：专注于大纲生成、草稿写作。
    - [x] 创建 `editor` 模式：专注于润色、改写、风格统一。
    - [x] 创建 `researcher` 模式：专注于资料搜索、摘要。
    - [x] 创建 `publisher` 模式：专注于格式调整、元数据生成。
    - [x] 在 `DEFAULT_MODES` 中替换原有代码模式。

- [x] **1.2 工具组配置与文件限制 (src/shared/tools.ts, src/shared/modes.ts)**
    - [x] 配置 `read` 组：保留读取文件能力。
    - [x] 配置 `edit` 组：添加 `fileRegex` 限制，仅允许修改 `\.(md|txt)$` 文件。
    - [x] 禁用/隐藏 `command` 组（终端执行）在非必要模式下的权限。
    - [x] 移除代码特有工具（如 `list_code_definition_names`）在写作模式下的可见性。

- [x] **1.3 系统提示词定制 (src/core/prompts/system.ts)**
    - [x] 编写 `writer` 模式的 `roleDefinition` 和 `customInstructions`。
    - [x] 编写 `editor` 模式的 `roleDefinition` 和 `customInstructions`。
    - [x] **[关键优化]** 修改系统提示生成逻辑，大幅精简非必要指令（如代码修复、测试指南等），移除代码相关的“能力展示”和“最佳实践”，替换为简洁的写作规范，以降低基础 Token 消耗。
    - [x] **[关键优化]** 优化上下文历史管理策略，在发送给模型前清理无用的中间工具调用日志，仅保留核心创作内容。

- [x] **1.4 清理与隐藏代码功能 (src/package.json, src/activate/registerCommands.ts)**
    - [x] `package.json`: 移除或隐藏 `explainCode`, `fixCode`, `improveCode` 等命令。
    - [x] `package.json`: 重命名/重新绑定侧边栏按钮功能（如将“Prompts”改为“Templates”）。
    - [x] 暂时禁用代码索引功能的自动启动。
    - [x] **[关键优化]** 在写作模式下，彻底移除重型工具（`execute_command`, `apply_diff`, `codebase_search`）的定义传输，仅保留 `read_file`, `write_to_file`, `browser_action` 等轻量工具，减少 Schema 占用的 Token。

## 2. 阶段二：用户界面与交互体验 (UI/UX for Writing)
目标：打造适合写作的沉浸式界面，提供大纲管理和项目视图。

- [x] **2.1 Webview 界面重构 (webview-ui/src)**
    - [x] 调整侧边栏布局，适应“项目-大纲-正文”的层级结构。
    - [x] 增加“写作项目”面板：显示书籍/文章元数据（标题、作者、摘要）。
    - [x] 实现简单的文件树视图，仅过滤显示 `.md` 和 `.txt` 文件。

- [x] **2.2 写作模板功能 (src/core/prompts/sections)**
    - [x] 实现“模板选择器” UI。
    - [x] 内置标准模板：技术博客、小说章节、学术论文、周报。
    - [x] 将模板注入到 `handleNewTask` 流程中。

- [x] **2.3 状态与快照管理**
    - [x] 利用现有的 Task History 机制，标记“版本快照”。
    - [x] 在 UI 上展示简单的版本回溯入口。

## 3. 阶段三：增强功能与 MCP 集成 (Enhancements & MCP) [Postponed]
目标：引入外部工具增强写作质量，支持多格式导出。

- [ ] **3.1 写作辅助 MCP Server 开发** (Postponed)
    - [ ] 开发/接入 Python MCP Server：提供文本统计（字数、阅读时间）。
    - [ ] 开发/接入 Python MCP Server：提供 NLP 分析（关键词密度、情感分析）。
    - [ ] 在 `.roo/mcp.json` 中配置默认的写作 MCP。

- [ ] **3.2 浏览器工具优化 (Researcher Mode)** (Postponed)
    - [ ] 优化 `browser_action` 在 Research 模式下的 Prompt，强调“引用来源”和“事实核查”。
    - [ ] 实现将浏览器抓取内容自动整理为 Markdown 笔记的功能。

- [ ] **3.3 导出功能** (Postponed)
    - [ ] 新增 `export_document` 工具（通过 MCP 或内置 Pandoc 调用）。
    - [ ] 支持 Markdown 导出为 HTML/PDF/Docx。

## 4. 阶段四：高级知识检索 (Advanced Knowledge Retrieval via MCP)
目标：放弃本地向量索引，完全依赖 MCP 集成 LightRAG 实现专业级知识管理与检索。

- [x] **4.1 LightRAG MCP 集成**
    - [ ] **[配置]** 在 `.roo/mcp.json` 中配置已有的 LightRAG MCP 服务连接（用户已在 Trae 中部署）。
    - [x] **[瘦身]** 彻底移除客户端 `CodeIndexManager` 及其相关依赖（Qdrant, Embedder, FileWatcher），大幅减轻插件体积与运行时负担。
    - [x] **[新增]** 确保 System Prompt 能正确引导模型调用 LightRAG MCP 提供的 `query_knowledge_base` 工具。

- [x] **4.2 知识库交互策略**
    - [x] 在 System Prompt 中定义策略：当用户询问背景知识、设定一致性或跨文档关系时，优先调用 `query_knowledge_base`。
    - [x] 保持聊天记录（Chat History）的本地存储机制不变，确保对话上下文的独立性。

- [ ] **4.3 引用管理** (Postponed)
    - [ ] 实现自动插入引用标记（`[^1]`）和参考文献列表的功能（配合 LightRAG 返回的引用源）。
