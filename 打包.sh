#!/bin/bash

echo "🚀 咖啡名片编辑器 - 一键打包"
echo "================================"
echo

echo "📦 开始打包..."
node package-simple.js

echo
echo "✅ 打包完成！"
echo "📁 打包目录: coffee-editor/"
echo
echo "📋 下一步:"
echo "1. 将 coffee-editor 文件夹上传到服务器"
echo "2. 按照'宝塔部署说明.txt'操作"
echo "3. 访问 http://您的域名:3000"
echo
