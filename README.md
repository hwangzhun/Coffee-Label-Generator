<div align="center">

# ☕ 咖啡标签生成器

*Coffee Label Generator*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green.svg)](https://nodejs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-blue.svg)](https://www.javascript.com/)

**一个专业的咖啡标签批量编辑和PDF生成工具，支持灵活的全局与单独设定模式**

[快速开始](#快速开始) • [功能特点](#功能特点) • [演示截图](#演示截图) • [API文档](#api文档)

</div>

---

## 📖 目录

- [功能特点](#功能特点)
- [快速开始](#快速开始)
- [核心功能](#核心功能)
- [技术栈](#技术栈)
- [API文档](#api文档)
- [开发指南](#开发指南)
- [部署说明](#部署说明)
- [注意事项](#注意事项)
- [许可证](#许可证)

---

## ✨ 功能特点

### 🎯 核心优势

- **📱 智能响应式设计** - 完美适配桌面端和移动端
- **⚡ 高性能处理** - 支持批量处理大量图片
- **🎨 专业PDF输出** - A4标准格式，带裁剪线设计
- **🔄 实时预览** - 所见即所得的编辑体验
- **📊 详细日志** - 完整的操作记录和数据追踪

### 🛠️ 主要功能

| 功能模块 | 描述 | 特性 |
|---------|------|------|
| 🖼️ **图片管理** | 动态图片加载与管理 | 从腾讯云 COS 自动扫描列表，支持常见图片格式 |
| 📝 **文字编辑** | 灵活的文本编辑系统 | 日历控件、自动格式化、全局/单独设定 |
| 👁️ **预览系统** | 高精度预览功能 | 1:1精确预览、点击放大、独立副本预览 |
| 🔤 **字体管理** | 智能字体加载系统 | OPPO Sans 4.0、进度显示、优雅降级 |
| 📄 **PDF生成** | 专业PDF输出 | 2×4网格布局、裁剪线、自动命名 |
| 📊 **日志系统** | 完整的操作记录 | 自动保存、按天编号、详细信息 |

---

## 🚀 快速开始

### 环境要求

- **Node.js** 16.0+ 
- **npm** 或 **yarn**
- 现代浏览器（支持ES6+）

### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/your-username/coffee-label-generator.git
cd coffee-label-generator

# 2. 安装依赖
npm install

# 3. 启动服务器
npm start

# 4. 打开浏览器访问
# http://localhost:3000
```

### 开发模式启动

```bash
# 使用 Parcel 开发服务器（推荐用于开发）
npm run serve

# 或使用 nodemon 监听文件变化
npm run dev
```

### 生产构建

```bash
# 仅前端 Parcel 打包到 dist/（不含服务端与零散 JS）
npm run build

# 推荐：清空缓存与 dist → Parcel 打包 → 复制 server、config、logger 等到 dist/
npm run build:prod

# 不经过 Parcel、保留独立 .js 文件时再打服务端包
npm run build:prod:static

# 仅删除 dist 与 .parcel-cache
npm run clean
```

---

## 🔧 核心功能

### 📸 智能图片管理

#### 自动扫描系统
- **动态加载**：通过后端或 COS SDK 列出存储桶前缀下的图片
- **格式支持**：JPG、PNG、GIF、BMP、WebP 等常见格式
- **智能排序**：数字文件名正确排序（1.jpg, 2.jpg, 10.jpg）
- **实时更新**：COS 上更新对象后刷新页面即可拉取新列表

### ✏️ 灵活文字编辑

#### 双模式设定
- **🌐 全局设定**：所有图片使用统一设置
- **🎯 单独设定**：每张图片每个副本独立设置

#### 智能输入控件
- **📅 烘焙日期**：日历选择器，自动格式化
- **⚖️ 重量设置**：数字输入，自动添加单位

### 🔍 高精度预览

- **实时渲染**：Canvas技术实现精确预览
- **1:1显示**：与最终PDF完全一致
- **交互体验**：点击放大、独立预览
- **手动更新**：避免输入时频繁刷新

### 🎨 智能字体系统

#### OPPO Sans 4.0 集成
```javascript
// 智能检测流程
检测字体可用性 → 显示加载进度 → 动态加载字体 → 优雅降级
```

- **进度显示**：实时下载进度（~2MB文件）
- **缓存机制**：浏览器自动缓存，提升性能
- **兼容性**：支持FontFace API和传统浏览器
- **主题适配**：亮色/暗色主题自动切换

### 📋 专业PDF输出

#### 标准化布局
- **页面规格**：A4无边距设计
- **网格排列**：2×4标准布局
- **裁剪线**：2px黑色实线，便于后期处理
- **自动分页**：支持超过8张图片的多页输出

#### 智能命名
```
📄 输出格式：YYYY-MM-DD.pdf
📄 示例：2024-03-15.pdf
```

---

## 🛠️ 技术栈

### 前端技术
```
HTML5 + CSS3 + JavaScript ES6+
├── Canvas API      # 图片处理与预览
├── FontFace API    # 动态字体加载  
├── Fetch API       # 数据通信
└── jsPDF          # PDF生成
```

### 后端架构
```
Node.js + Express
├── 静态文件服务
├── RESTful API
├── 文件系统操作
└── 日志管理
```

### 核心依赖
| 包名 | 版本 | 用途 |
|------|------|------|
| `express` | ^4.18.0 | Web服务器框架 |
| `jspdf` | ^2.5.0 | PDF生成库 |
| `nodemon` | ^2.0.0 | 开发热重载 |

---

## 📡 API文档

### 图片管理

```http
GET /api/images
```
**响应示例：**
```json
{
  "success": true,
  "images": [
    "2015陈年曼特宁.png",
    "克里夫顿庄园-蓝山一号.png"
  ]
}
```

### 日志管理

```http
POST /api/save-log
Content-Type: application/json

{
  "filename": "2024-01-15-01.log",
  "content": "详细日志内容...",
  "logData": {
    "timestamp": 1705123456789,
    "mode": "global",
    "imageCount": 5
  }
}
```

```http
GET /api/logs
```

```http
GET /api/logs/:filename
```

### 日志文件结构

```
📋 日志信息包含：
├── 🕒 生成时间戳
├── 📄 PDF文件名
├── ⚙️ 设定模式（全局/单独）
├── 📊 图片数量统计
├── 📑 PDF页数信息
├── 🖼️ 图片详细信息
└── 📝 设定详情记录
```

---

## 👨‍💻 开发指南

### 项目结构

```
Coffee-Label-Generator/
├── 📁 log/                 # 日志文件存储
├── 📁 dist/                # 构建输出目录
├── 📁 md/                  # 文档说明文件
├── 📄 index.html           # 主页面
├── 📄 script.js            # 核心逻辑
├── 📄 style.css            # 样式文件
├── 📄 server.js            # 服务器入口
├── 📄 server-cos.js        # COS 签名与列表 API
├── 📄 config.js            # 前端 CDN / COS 行为配置
└── 📄 package.json         # 项目配置
```

### 开发流程

1. **环境准备**
   ```bash
   npm install
   npm run dev
   ```

2. **功能开发**
   - 前端：修改`script.js`、`style.css`、`config.js`
   - 后端：修改`server.js`、`server-cos.js`
   - 密钥：本地使用`.env`（参考`.env.example`），勿提交仓库

3. **测试验证**
   - 检查 COS 列表与签名是否正常
   - 检查日志文件生成
   - 验证 PDF 输出质量

### 调试技巧

```javascript
// 启用详细日志
console.log('Debug mode enabled');

// 字体加载状态检查
document.fonts.ready.then(() => {
    console.log('All fonts loaded');
});

// PDF生成调试
const debugPDF = true;
```

---

## 🚀 部署说明

### 服务器部署

1. **环境配置**
   ```bash
   # 安装 Node.js 16+
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **应用部署**
   ```bash
   # 克隆代码
   git clone <repository-url>
   cd coffee-label-generator
   
   # 安装依赖
   npm install --production
   
   # 启动服务
   npm start
   ```

3. **进程管理**
   ```bash
   # 使用 PM2 管理进程
   npm install -g pm2
   pm2 start server.js --name coffee-generator
   pm2 startup
   pm2 save
   ```

### 宝塔面板部署

详细步骤请参考：[宝塔部署详细指南](md/宝塔部署详细指南.md)

### 腾讯云 COS

图片与名称映射放在 COS/CDN 上；前端见 `config.js`（`baseUrl`、`autoScan` 等），服务端密钥见 `.env.example` 与 `server-cos.js`。

---

## ⚠️ 注意事项

### 🔧 系统要求

- **COS 与配置**：确保 `config.js` 与 `.env`（或部署环境变量）与存储桶一致，图片在 COS 上可读
- **日志目录**：系统会自动创建`log/`文件夹
- **浏览器兼容**：建议使用Chrome 80+、Firefox 75+、Safari 13+

### 📝 使用建议

1. **图片管理**
   - 图片文件名避免特殊字符
   - 推荐使用PNG格式获得最佳质量
   - 单个图片文件建议不超过5MB

2. **性能优化**
   - 首次访问需要下载字体文件（~2MB）
   - 后续访问会使用浏览器缓存
   - 建议在良好网络环境下首次使用

3. **数据安全**
   - 日志文件包含敏感信息，请妥善保管
   - 定期清理过期日志文件
   - 生产环境建议配置HTTPS

### 🐛 常见问题

**Q: 字体加载失败怎么办？**
A: 系统会自动降级到系统默认字体，不影响正常使用。

**Q: PDF生成失败？**
A: 检查图片文件是否存在，浏览器控制台是否有错误信息。

**Q: 日志文件保存失败？**
A: 系统会自动下载到本地，检查浏览器下载设置。

---

## 📄 许可证

```
MIT License

Copyright (c) 2024 Coffee Label Generator

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

**🌟 如果这个项目对您有帮助，请给个Star支持一下！**

[⬆ 回到顶部](#-咖啡标签生成器)

</div>