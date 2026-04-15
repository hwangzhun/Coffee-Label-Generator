const fs = require('fs');
const path = require('path');

console.log('🚀 简单打包 - 宝塔面板专用\n');

const packageDir = 'coffee-editor';
if (fs.existsSync(packageDir)) {
    fs.rmSync(packageDir, { recursive: true, force: true });
}

fs.mkdirSync(packageDir, { recursive: true });

const rootPkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));

const files = [
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

files.forEach((file) => {
    if (fs.existsSync(file)) {
        fs.copyFileSync(file, path.join(packageDir, file));
        console.log(`✅ ${file}`);
    } else {
        console.log(`⚠️  ${file} (不存在，已跳过)`);
    }
});

const deployGuide = `# 宝塔面板部署指南

## 🚀 部署步骤

### 1️⃣ 上传文件
将 coffee-editor 目录内文件上传到网站根目录（如 /www/wwwroot/你的域名/）。

### 2️⃣ 安装 Node.js
宝塔 → 软件商店 → Node.js 版本管理器 → 建议 Node.js 18+。

### 3️⃣ 配置环境变量
复制 .env.example 为 .env，填写 COS_SECRET_ID、COS_SECRET_KEY、桶与地域（与腾讯云控制台一致）。

### 4️⃣ 安装依赖
在网站目录执行：npm install

### 5️⃣ 启动
PM2 添加项目：启动文件 server.js，端口 3000（或配合反向代理）。

## 📁 主要文件
- server.js / server-cos.js：服务与 COS API
- config.js：前端 baseUrl、autoScan、是否走后端签名等
- index.html、script.js、style.css、logger.js、cos-*.js：前端

## 🌐 图片与 COS
图片在腾讯云 COS；列表由后端扫描。若列表为空，检查 .env、config.js 前缀与桶权限。

## 🔧 常用命令
- pm2 restart coffee-editor
- pm2 logs coffee-editor
`;

fs.writeFileSync(path.join(packageDir, '宝塔部署说明.txt'), deployGuide);

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
console.log('✅ package.json (仅生产依赖)');

console.log('\n🎉 打包完成！');
console.log(`📦 打包目录: ${packageDir}/`);
console.log('1. 上传 coffee-editor 到服务器');
console.log('2. 按 宝塔部署说明.txt 配置 .env 并 npm install');
