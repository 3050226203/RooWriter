# RooWriter

RooWriter 是一个基于 [Roo-Code](https://github.com/RooVetGit/Roo-Code) 深度改造的专业 AI 写作助手，从一个编程 Agent 转型为专注于沉浸式写作、编辑和研究的工具。

## 🎯 愿景

- **从程序员到作家**：将重心从代码生成转移到创意内容创作。
- **沉浸式体验**：提供专注的大纲、草稿和润色模式。
- **Token 经济性**：精简 Prompt 和工具集，最大化长文写作的上下文窗口。
- **知识集成**：原生支持模型上下文协议 (MCP)，可访问外部知识库 (LightRAG)。

## ✨ 核心特性

### 1. 模式驱动架构
RooWriter 引入了四种专用模式，每种模式都有定制的 Prompt 和工具权限：

- **Writer (作家) ✍️**：专注于大纲、头脑风暴和草稿写作。拥有文件创建和读取权限。
- **Editor (编辑) 📝**：专注于润色、风格统一和校对。
- **Researcher (研究员) 🔍**：专注于通过浏览器工具进行事实核查和信息收集。
- **Publisher (出版) 📢**：专注于格式调整、元数据管理和最终输出准备。

### 2. 轻量化与 MCP 优先
为了减少臃肿并提高性能：
- **移除**：本地向量数据库 (Qdrant)、代码 Embeddings 和重型的代码库搜索工具。
- **新增**：深度集成 **模型上下文协议 (MCP)**。
- **知识库**：依赖外部 MCP 服务器（如 LightRAG）通过 `query_knowledge_base` 工具进行知识检索。

### 3. 优化的 System Prompts
- **Token 经济**：从 System Prompts 中移除了代码特定的指令（测试执行、终端命令）。
- **上下文清洗**：自动过滤冗余的工具日志，保持写作上下文的整洁。
- **RAG 策略**：针对涉及背景知识或设定一致性的问题，强制执行“先检索再回答”策略。

## 🛠️ 技术架构

- **核心**：VS Code Extension API
- **界面**：React + Vite + Tailwind CSS (`webview-ui/`)
- **通信**：MCP (Model Context Protocol)

## 🚀 快速开始

### 先决条件
- Node.js & pnpm
- VS Code

### 开发设置

1. **安装依赖**：
   ```bash
   pnpm install
   ```

2. **运行插件**：
   - 在 VS Code 中打开项目。
   - 按 `F5` 在新的扩展开发主机窗口中启动插件。

3. **配置知识库（可选但推荐）**：
   - 要启用 RAG 功能，请在 `~/.roo/mcp.json`（或项目特定配置）中配置您的 LightRAG MCP 服务器。
   - 确保 MCP 服务器暴露名为 `query_knowledge_base` 的工具。

## 🗺️ 路线图

### 当前状态 (v1.0)
- ✅ 专业的写作模式
- ✅ UI 重构（项目面板、大纲视图）
- ✅ 用于知识检索的 MCP 集成
- ✅ Token 使用优化

### 未来规划 / 已搁置
- ⏸️ **写作分析**：字数统计、阅读时间、情感分析（通过 Python MCP）。
- ⏸️ **增强研究**：从浏览器会话自动生成笔记。
- ⏸️ **导出工具**：通过 Pandoc 导出 PDF/HTML/Docx。
- ⏸️ **引用管理**：自动插入引用和生成参考书目。

## 📄 许可证

[Apache 2.0](LICENSE)
