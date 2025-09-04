# 咖啡名片编辑器 - 部署包

## 📦 包含文件
- `index.html` - 主页面
- `style.css` - 样式文件  
- `script.js` - 前端逻辑
- `server.js` - Node.js服务器
- `package.json` - 项目配置
- `img/` - 图片文件夹
- `log/` - 日志文件夹
- `.env` - 环境配置
- `start.sh` - Linux/Mac启动脚本
- `start.bat` - Windows启动脚本
- `ecosystem.config.js` - PM2配置

## 🚀 快速启动

### Linux/Mac
```bash
chmod +x start.sh
./start.sh
```

### Windows
```cmd
start.bat
```

### 使用PM2 (推荐生产环境)
```bash
npm install -g pm2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

## 🌐 访问地址
启动后访问: http://localhost:3000

## 📁 目录结构
```
build/
├── index.html
├── style.css
├── script.js
├── server.js
├── package.json
├── .env
├── start.sh
├── start.bat
├── ecosystem.config.js
├── img/           # 图片文件夹
└── log/           # 日志文件夹
```

## ⚙️ 配置说明
- 修改 `.env` 文件来调整配置
- 将图片文件放入 `img/` 文件夹
- 日志文件保存在 `log/` 文件夹

## 🔧 生产环境建议
1. 使用PM2进行进程管理
2. 配置反向代理 (Nginx)
3. 设置防火墙规则
4. 定期备份日志文件
5. 监控服务器资源使用情况
