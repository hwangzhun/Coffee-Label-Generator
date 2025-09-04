# 咖啡名片批量编辑器

一个功能强大的咖啡名片批量编辑和PDF生成工具，支持全局设定和单独设定模式。

## 功能特点

### 🖼️ 图片管理
- 支持从本地`img/`文件夹动态加载图片（支持多种格式：JPG、PNG、GIF、BMP、WebP）
- 多选图片功能
- 每张图片独立设置制作数量

### 📝 文字编辑
- **烘焙日期**：使用日历控件，自动格式化为"烘焙日期：年月日"
- **重量**：数字输入，自动添加"g"单位
- **全局设定**：所有图片使用相同设置
- **单独设定**：每张图片的每个副本都可以设置不同的烘焙日期和重量

### 👁️ 预览功能
- 手动预览更新，避免输入时频繁刷新
- 1:1精确预览，与最终PDF完全一致
- 显示每个副本的独立预览
- 点击图片可放大查看

### 📄 PDF生成
- 无边距A4布局，2×4网格排列
- 自动添加2px黑色裁剪线，方便打印后裁剪
- 文件名自动使用当天日期格式（YYYY-MM-DD.pdf）

### 📊 日志记录
- 自动生成详细的log文件
- 保存到服务器`log/`文件夹
- 文件名带序号：YYYY-MM-DD-01.log（每天重置计数器）
- 包含完整的生成信息和图片详情
- 网络失败时自动下载到本地作为备份

## 安装和运行

### 1. 安装依赖
```bash
npm install
```

### 2. 启动服务器
```bash
npm start
```

### 3. 访问应用
打开浏览器访问：http://localhost:3000

## 打包和部署

### 方法一：直接部署（推荐）

#### 1. 准备服务器环境
```bash
# 安装Node.js (推荐版本 16+)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 或者使用yum (CentOS/RHEL)
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

#### 2. 上传项目文件
```bash
# 使用scp上传文件
scp -r ./coffee-card-editor user@your-server:/var/www/

# 或使用git克隆
git clone <your-repo-url> /var/www/coffee-card-editor
cd /var/www/coffee-card-editor
```

#### 3. 安装依赖并启动
```bash
cd /var/www/coffee-card-editor
npm install --production
npm start
```

#### 4. 配置反向代理（Nginx）
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 5. 使用PM2管理进程（推荐）
```bash
# 安装PM2
npm install -g pm2

# 启动应用
pm2 start server.js --name "coffee-card-editor"

# 设置开机自启
pm2 startup
pm2 save

# 查看状态
pm2 status
pm2 logs coffee-card-editor
```

### 方法二：Docker部署

#### 1. 创建Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

#### 2. 构建和运行
```bash
# 构建镜像
docker build -t coffee-card-editor .

# 运行容器
docker run -d \
  --name coffee-card-editor \
  -p 3000:3000 \
  -v $(pwd)/log:/app/log \
  -v $(pwd)/img:/app/img \
  coffee-card-editor
```

#### 3. 使用Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  coffee-card-editor:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./log:/app/log
      - ./img:/app/img
    restart: unless-stopped
```

```bash
# 启动服务
docker-compose up -d
```

### 方法三：静态文件部署

#### 1. 修改服务器配置
```javascript
// 修改server.js，添加静态文件服务
app.use(express.static('public'));

// 将前端文件移动到public目录
// public/
//   ├── index.html
//   ├── style.css
//   ├── script.js
//   └── img/
```

#### 2. 部署到CDN或静态托管
```bash
# 上传到阿里云OSS
ossutil cp -r ./public/ oss://your-bucket/coffee-card-editor/

# 上传到腾讯云COS
coscmd upload -r ./public/ /coffee-card-editor/

# 上传到AWS S3
aws s3 sync ./public/ s3://your-bucket/coffee-card-editor/
```

## 生产环境配置

### 1. 环境变量配置
```bash
# 创建.env文件
NODE_ENV=production
PORT=3000
LOG_DIR=/var/log/coffee-card-editor
```

### 2. 日志管理
```bash
# 创建日志目录
sudo mkdir -p /var/log/coffee-card-editor
sudo chown -R $USER:$USER /var/log/coffee-card-editor

# 配置日志轮转
sudo nano /etc/logrotate.d/coffee-card-editor
```

```bash
# /etc/logrotate.d/coffee-card-editor
/var/log/coffee-card-editor/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
}
```

### 3. 安全配置
```bash
# 安装防火墙
sudo ufw enable
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443

# 配置SSL证书（Let's Encrypt）
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 4. 监控和备份
```bash
# 使用PM2监控
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# 设置定时备份
crontab -e
# 添加以下行
0 2 * * * tar -czf /backup/coffee-card-editor-$(date +\%Y\%m\%d).tar.gz /var/www/coffee-card-editor
```

## 文件结构

```
├── index.html          # 主页面
├── style.css           # 样式文件
├── script.js           # 主要逻辑
├── server.js           # Node.js服务器
├── package.json        # 项目配置
├── img/                # 图片文件夹（动态加载）
│   ├── 咖啡豆1.jpg
│   ├── 烘焙日期.png
│   └── ...（任意名称的图片文件）
└── log/                # 日志文件夹（自动创建）
    ├── 2024-01-15.log
    └── ...
```

## 使用流程

### 第一步：选择图片
- 从8张预设图片中选择需要的图片
- 支持多选

### 第二步：设置数量
- 为每张选中的图片设置制作数量
- 实时显示总数量统计

### 第三步：输入文本
- 选择设定模式（全局/单独）
- **全局设定**：所有图片使用相同的烘焙日期和重量
- **单独设定**：每张图片的每个副本都可以设置不同的烘焙日期和重量
- 点击"更新预览"查看效果（显示每个副本的预览）

### 第四步：导出PDF
- 生成PDF文件（自动分页，超过8张图片时正确分页）
- 自动保存log文件到服务器（带序号：YYYY-MM-DD-01.log）
- 下载PDF到本地（文件名：YYYY-MM-DD.pdf）

## API接口

### 保存日志
```
POST /api/save-log
Content-Type: application/json

{
  "filename": "2024-01-15.log",
  "content": "日志内容...",
  "logData": {...}
}
```

### 获取日志列表
```
GET /api/logs
```

### 下载日志文件
```
GET /api/logs/:filename
```

## 日志文件格式

日志文件包含以下详细信息：
- 生成时间和时间戳
- PDF文件名
- 设定模式（全局/单独）
- 图片数量和总制作数量
- PDF页数
- 每张图片的详细信息
- 全局设定或单独设定详情

## 技术栈

- **前端**：HTML5, CSS3, JavaScript (ES6+)
- **后端**：Node.js, Express
- **PDF生成**：jsPDF
- **图片处理**：Canvas API

## 🖼️ 动态图片加载功能

### 📁 图片文件夹管理
- **自动扫描**：系统启动时自动扫描`img/`文件夹中的所有图片
- **多格式支持**：支持JPG、PNG、GIF、BMP、WebP等常见图片格式
- **灵活命名**：图片文件名可以是任意名称，系统会自动识别和排序
- **实时更新**：添加或删除图片后，刷新页面即可看到变化
- **简洁显示**：自动忽略文件扩展名，只显示文件名主体部分

### 🔧 技术实现
- **服务器端API**：`GET /api/images` 获取图片文件列表
- **智能排序**：按文件名进行数字排序（1.jpg, 2.jpg, 10.jpg 会正确排序）
- **错误处理**：如果服务器API失败，会回退到预定义列表
- **格式验证**：只加载支持的图片格式文件

### 📝 使用示例
```
img/
├── 咖啡豆1.jpg          # 显示为：咖啡豆1
├── 咖啡豆2.jpg          # 显示为：咖啡豆2
├── 烘焙日期.png         # 显示为：烘焙日期
├── 重量标签.gif         # 显示为：重量标签
└── 其他图片.webp        # 显示为：其他图片
```

### 💡 显示名称优化
- **自动处理**：系统会自动移除文件扩展名，让界面更加简洁
- **保持功能**：文件扩展名仍然用于格式识别和加载
- **用户友好**：用户看到的是简洁的文件名，没有技术细节干扰

## 注意事项

1. 确保`img/`文件夹中有图片文件（支持JPG、PNG、GIF、BMP、WebP格式，文件名任意）
2. 服务器会自动创建`log/`文件夹
3. 如果服务器保存失败，log文件会自动下载到本地
4. PDF文件名使用当天日期，避免覆盖
5. 裁剪线为2px黑色实线，适合打印后裁剪
6. 单独设定模式下，每个副本都有独立的预览和设定
7. 支持超过8张图片的自动分页功能
8. Log文件按天编号，每天重置计数器

## 开发模式

使用nodemon进行开发：
```bash
npm run dev
```

## 许可证

MIT License