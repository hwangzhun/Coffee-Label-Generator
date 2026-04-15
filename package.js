const fs = require('fs');
const path = require('path');

console.log('🚀 开始打包咖啡名片编辑器...\n');

// 创建打包目录
const packageDir = 'coffee-card-editor-package';
if (fs.existsSync(packageDir)) {
    console.log('📁 清理旧的打包目录...');
    fs.rmSync(packageDir, { recursive: true, force: true });
}

console.log('📁 创建打包目录...');
fs.mkdirSync(packageDir, { recursive: true });

// 需要复制的文件列表（图片在 COS，不在仓库 img/）
const filesToCopy = [
    'index.html',
    'style.css',
    'script.js',
    'server.js',
    'server-cos.js',
    'package.json',
    'package-lock.json',
    'config.js',
    'config.local.js',
    'logger.js',
    'cos-api-utils.js',
    'cos-utils.js',
    'icon.svg',
    'name-mapping.json',
    '.env.example'
];

const foldersToCopy = [];

const rootPkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));

console.log('📄 复制文件...');
filesToCopy.forEach(file => {
    if (fs.existsSync(file)) {
        fs.copyFileSync(file, path.join(packageDir, file));
        console.log(`  ✅ ${file}`);
    } else {
        console.log(`  ⚠️  ${file} (文件不存在)`);
    }
});

console.log('📁 复制文件夹...');
foldersToCopy.forEach(folder => {
    if (fs.existsSync(folder)) {
        copyFolderRecursive(folder, path.join(packageDir, folder));
        console.log(`  ✅ ${folder}/`);
    } else {
        console.log(`  ⚠️  ${folder}/ (文件夹不存在)`);
    }
});

// 创建部署说明文件
const deployInstructions = `# 咖啡名片编辑器 - 部署说明

## 📦 打包信息
- 打包时间: ${new Date().toLocaleString('zh-CN')}
- 版本: ${rootPkg.version}
- 包含文件: ${filesToCopy.join(', ')}

## 🚀 宝塔面板部署步骤

### 1. 上传文件
1. 登录宝塔面板
2. 进入"文件"管理
3. 导航到您的网站根目录 (通常是 /www/wwwroot/您的域名/)
4. 上传整个 coffee-card-editor-package 文件夹
5. 解压或直接复制所有文件到网站根目录

### 2. 安装Node.js环境
1. 在宝塔面板中进入"软件商店"
2. 搜索并安装 "Node.js版本管理器"
3. 安装 Node.js 16.x 或更高版本

### 3. 安装依赖
1. 在宝塔面板中进入"终端"
2. 导航到网站目录: cd /www/wwwroot/您的域名/
3. 运行: npm install

### 4. 启动服务
1. 在宝塔面板中进入"PM2管理器"
2. 添加新项目:
   - 项目名称: coffee-card-editor
   - 运行目录: /www/wwwroot/您的域名/
   - 启动文件: server.js
   - 端口: 3000
3. 点击"启动"

### 5. 配置反向代理 (可选)
1. 在宝塔面板中进入"网站"设置
2. 选择您的网站，点击"设置"
3. 进入"反向代理"
4. 添加代理:
   - 代理名称: coffee-card-editor
   - 目标URL: http://127.0.0.1:3000
   - 发送域名: $host

## 📝 访问地址
- 直接访问: http://您的域名:3000
- 通过代理访问: http://您的域名 (如果配置了反向代理)

## 🔧 常用命令
- 查看日志: pm2 logs coffee-card-editor
- 重启服务: pm2 restart coffee-card-editor
- 停止服务: pm2 stop coffee-card-editor

## 📁 文件结构
\`\`\`
网站根目录/
├── index.html          # 主页面
├── style.css           # 样式文件
├── script.js           # 前端逻辑
├── server.js           # 后端入口
├── server-cos.js       # COS 签名与列表 API
├── package.json        # 项目配置
├── config.js           # 前端 COS/CDN 行为配置
├── config.local.js     # 本地可选覆盖（密钥等勿提交）
├── logger.js / cos-*.js
├── .env                # 服务端密钥（由 .env.example 复制，勿提交）
└── log/                # 日志文件夹 (自动创建)
\`\`\`

## 🌐 腾讯云 COS
- 图片与名称映射在存储桶/CDN；前端 \`config.js\` 配置 \`baseUrl\`、\`autoScan\` 等
- 服务端复制 \`.env.example\` 为 \`.env\` 并填写 COS_SECRET_ID / COS_SECRET_KEY 等

## ⚠️ 注意事项
1. 确保服务器端口3000未被占用
2. 确保 COS 与 \`config.js\`、\`.env\` 中桶与地域一致
3. 建议配置 SSL
4. 定期备份 log 目录

## 🆘 故障排除
- 无法访问：防火墙、端口、PM2 状态
- 图片列表为空：COS 权限、前缀、后端 \`/api/cos\` 是否正常
- PDF 失败：浏览器控制台、图片跨域与 CORS
`;

fs.writeFileSync(path.join(packageDir, 'DEPLOY.md'), deployInstructions);
console.log('  ✅ DEPLOY.md (部署说明)');

// 创建启动脚本
const startScript = `#!/bin/bash
echo "🚀 启动咖啡名片编辑器..."
echo "📁 当前目录: $(pwd)"
echo "📦 检查依赖..."

if [ ! -d "node_modules" ]; then
    echo "📥 安装依赖..."
    npm install
fi

echo "🔧 启动服务器..."
node server.js
`;

fs.writeFileSync(path.join(packageDir, 'start.sh'), startScript);
console.log('  ✅ start.sh (启动脚本)');

// 创建Windows启动脚本
const startBat = `@echo off
echo 🚀 启动咖啡名片编辑器...
echo 📁 当前目录: %CD%
echo 📦 检查依赖...

if not exist "node_modules" (
    echo 📥 安装依赖...
    npm install
)

echo 🔧 启动服务器...
node server.js
pause
`;

fs.writeFileSync(path.join(packageDir, 'start.bat'), startBat);
console.log('  ✅ start.bat (Windows启动脚本)');

const prodPackageJson = {
    name: rootPkg.name,
    version: rootPkg.version,
    description: rootPkg.description,
    main: 'server.js',
    scripts: { start: 'node server.js' },
    dependencies: rootPkg.dependencies,
    keywords: rootPkg.keywords,
    author: rootPkg.author,
    license: rootPkg.license
};

fs.writeFileSync(path.join(packageDir, 'package.json'), JSON.stringify(prodPackageJson, null, 2));
console.log('  ✅ package.json (生产依赖，已去掉 devDependencies)');

console.log('\n🎉 打包完成！');
console.log(`📦 打包目录: ${packageDir}/`);
console.log('\n📋 下一步操作:');
console.log('1. 将整个 coffee-card-editor-package 文件夹上传到服务器');
console.log('2. 按照 DEPLOY.md 中的说明进行部署');
console.log('3. 或者直接运行 start.sh (Linux/Mac) 或 start.bat (Windows)');

// 递归复制文件夹的函数
function copyFolderRecursive(source, target) {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
    }
    
    const files = fs.readdirSync(source);
    files.forEach(file => {
        const sourcePath = path.join(source, file);
        const targetPath = path.join(target, file);
        
        if (fs.statSync(sourcePath).isDirectory()) {
            copyFolderRecursive(sourcePath, targetPath);
        } else {
            fs.copyFileSync(sourcePath, targetPath);
        }
    });
}
