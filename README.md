# Humanize-AI.top

## 网站定位
**Humanize-AI.top** 是一个多语言支持的高级AI文本处理平台，专注于将AI生成的内容转化为更自然、更人性化的文本。我们的服务提供以下核心功能：

1. **多样化的文本风格转换**：支持多种文本风格，包括标准、学术、简洁、流畅、正式、非正式、详细和简短等，满足不同场景的需求。

2. **智能文本处理**：利用先进的AI技术，对输入的文本进行智能分析和处理，确保输出的内容更符合人类的写作风格。

3. **灵活的用户订阅系统**：提供基于单词数量的订阅模式，用户可以根据自己的需求选择合适的套餐。

4. **安全的用户认证**：集成Firebase认证系统，确保用户数据的安全性和隐私保护。

5. **高效的API集成**：使用DeepSeek API进行文本处理，保证处理速度和质量。

6. **用户友好的界面**：提供直观、简洁的用户界面，支持多语言，适应不同地区用户的需求。

7. **智能词数限制**：自动识别输入文本的字数，并根据用户的订阅状态和剩余字数限制提供相应的服务。

8. **实时处理反馈**：通过WebSocket技术，为用户提供实时的处理进度和结果反馈。

Humanize-AI.top 致力于为内容创作者、学术研究人员、商业写作者等提供高质量的AI辅助写作服务，帮助用户快速生成自然、流畅、符合特定风格的文本内容。

## 目前实现的功能
- **多语言支持**：用户可以选择不同的语言界面。
- **文本输入和输出**：用户可以在左侧文本框中输入文本，点击按钮后，右侧文本框将显示AI生成的文本输出。
- **主题切换**：用户可以在浅色和深色模式之间切换。
- **响应式设计**：确保在各种设备上都有良好的显示效果。
- **用户认证**：支持用户注册和登录功能，确保用户数据的安全性。
- **历史记录**：用户可以查看和管理自己的文本处理历史记录。

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
├── login/
│   └── page.js
├── register/
│   └── page.js
├── account/
│   └── page.js
├── history/
│   └── page.js
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

### app/login/page.js
用户登录页面，处理用户登录逻辑。

### app/register/page.js
用户注册页面，处理新用户注册逻辑。

### app/account/page.js
用户账户页面，显示用户信息和账户设置。

### app/history/page.js
历史记录页面，显示用户的文本处理历史记录。

### styles/globals.css
全局样式文件，包含基本的样式设置。

## 下一步规划

1. **更多语言支持**：扩展支持更多的语言，满足不同用户的需求。
2. **高级文本处理功能**：添加更多的文本处理功能，如文本摘要、情感分析等。
3. **优化性能**：进一步优化网站的性能，确保快速响应和流畅的用户体验。
4. **无障碍设计**：确保网站对所有用户都友好，包括那些有视觉或听觉障碍的用户。
5. **用户偏好设置**：允许用户自定义文本处理的偏好和设置。

## 如何运行项目

1. **克隆项目到本地**：
   ```bash
   git clone https://github.com/alchaincyf/aihumanize.git
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

