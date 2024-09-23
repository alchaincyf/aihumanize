# Humanize-AI.top

## 网站定位
**Humanize-AI.top** 是一个多语言支持的文本处理平台，用户可以输入文本并通过点击按钮来获取AI生成的文本输出。该平台旨在提供简洁、直观的用户体验，并支持多种语言。

## 目前实现的功能
- **多语言支持**：用户可以选择不同的语言界面。
- **文本输入和输出**：用户可以在左侧文本框中输入文本，点击按钮后，右侧文本框将显示AI生成的文本输出。
- **主题切换**：用户可以在浅色和深色模式之间切换。
- **响应式设计**：确保在各种设备上都有良好的显示效果。

## 文件结构
app/
├── api/
│   └── humanize/
│       └── route.js
├── components/
│   ├── Layout.js
│   ├── TextInput.js
│   ├── TextOutput.js
│   └── HumanizeButton.js
├── [lang]/
│   ├── page.js
│   └── layout.js
├── page.js
├── page.tsx
├── _app.js
├── translations.js
.env.local
middleware.js
styles/
└── globals.css

## 主要文件功能

### app/api/humanize/route.js
处理 `/api/humanize` 路由的API请求，接收用户输入的文本并返回AI生成的文本输出。

### app/components/Layout.js
共享的布局组件，包含头部导航栏、主题切换按钮和页脚。所有页面都使用该组件来保持一致的布局和样式。

### app/components/TextInput.js
文本输入组件，用户可以在此输入文本。

### app/components/TextOutput.js
文本输出组件，逐步显示AI生成的文本输出。

### app/components/HumanizeButton.js
按钮组件，用户点击后触发文本处理请求。

### app/[lang]/page.js
处理带有语言参数的路径，例如 `/zh` 或 `/en`。使用 `Layout` 组件包裹页面内容。

### app/page.tsx
主要页面组件文件，包含页面的主要逻辑和布局。使用 `Layout` 组件包裹页面内容。

### app/_app.js
全局应用组件，确保Material-UI的主题提供器包裹整个应用。

### app/translations.js
包含不同语言的翻译文本。

### styles/globals.css
全局样式文件，包含基本的样式设置。

## 下一步规划

1. **用户认证**：添加用户注册和登录功能，确保用户数据的安全性。
2. **更多语言支持**：扩展支持更多的语言，满足不同用户的需求。
3. **高级文本处理功能**：添加更多的文本处理功能，如文本摘要、情感分析等。
4. **优化性能**：进一步优化网站的性能，确保快速响应和流畅的用户体验。
5. **无障碍设计**：确保网站对所有用户都友好，包括那些有视觉或听觉障碍的用户。

## 如何运行项目

1. **克隆项目到本地**：
   ```bash
   git clone https://github.com/your-repo/my-website.git
   ```

2. **安装依赖**：
   ```bash
   cd my-website
   npm install
   ```

3. **运行开发服务器**：
   ```bash
   npm run dev
   ```

4. **打开浏览器访问** `http://localhost:3000` 查看网站。

## 环境变量

在项目根目录下创建 `.env.local` 文件，并添加以下内容：