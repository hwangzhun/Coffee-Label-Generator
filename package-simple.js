const fs = require('fs');
const path = require('path');

console.log('🚀 简单打包 - 宝塔面板专用\n');

// 创建打包目录
const packageDir = 'coffee-editor';
if (fs.existsSync(packageDir)) {
    fs.rmSync(packageDir, { recursive: true, force: true });
}

fs.mkdirSync(packageDir, { recursive: true });

// 复制所有必要文件
const files = ['index.html', 'style.css', 'script.js', 'server.js', 'package.json', 'config.js','icon.svg'];
files.forEach(file => {
    if (fs.existsSync(file)) {
        fs.copyFileSync(file, path.join(packageDir, file));
        console.log(`✅ ${file}`);
    }
});

// 不再需要复制img文件夹，现在完全依赖CDN

// 创建宝塔面板部署说明
const deployGuide = `# 宝塔面板部署指南

## 🚀 超简单部署步骤

### 1️⃣ 上传文件
1. 登录宝塔面板
2. 进入"文件"管理
3. 进入您的网站目录 (如: /www/wwwroot/您的域名/)
4. 上传整个 coffee-editor 文件夹
5. 解压到网站根目录

### 2️⃣ 安装Node.js
1. 宝塔面板 → 软件商店
2. 搜索"Node.js版本管理器"
3. 安装 Node.js 16.x

### 3️⃣ 安装依赖
1. 宝塔面板 → 终端
2. 进入网站目录: cd /www/wwwroot/您的域名/
3. 运行: npm install

### 4️⃣ 启动服务
1. 宝塔面板 → PM2管理器
2. 添加项目:
   - 名称: coffee-editor
   - 启动文件: server.js
   - 端口: 3000
3. 启动

### 5️⃣ 访问网站
- 地址: http://您的域名:3000
- 或配置反向代理到80端口

## 📁 文件说明
- index.html: 主页面
- style.css: 样式文件  
- script.js: 前端逻辑
- server.js: 后端服务器
- package.json: 项目配置
- config.js: CDN配置文件

## 🌐 CDN配置要求
- 系统完全依赖CDN获取图片
- 需要配置正确的CDN地址在 config.js 中
- 确保CDN服务可用且支持跨域访问

## 🔧 常用命令
- 重启: pm2 restart coffee-editor
- 查看日志: pm2 logs coffee-editor
- 停止: pm2 stop coffee-editor

## ⚠️ 注意事项
1. 确保端口3000可用
2. 确保CDN服务可用且网络连接正常
3. 建议配置SSL证书
4. 如果图片无法加载，检查CDN配置和网络连接
`;

fs.writeFileSync(path.join(packageDir, '宝塔部署说明.txt'), deployGuide);

console.log('\n🎉 打包完成！');
console.log(`📦 打包目录: ${packageDir}/`);
console.log('\n📋 部署步骤:');
console.log('1. 上传 coffee-editor 文件夹到服务器');
console.log('2. 按照"宝塔部署说明.txt"操作');
console.log('3. 访问 http://您的域名:3000');

function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src);
    files.forEach(file => {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        
        if (fs.statSync(srcPath).isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
}
