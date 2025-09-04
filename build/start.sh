#!/bin/bash
echo "🚀 启动咖啡名片编辑器服务器..."
echo "📁 工作目录: $(pwd)"
echo "🌐 访问地址: http://localhost:3000"
echo "=" | head -c 50; echo

# 检查Node.js版本
node_version=$(node -v)
echo "📦 Node.js版本: $node_version"

# 安装依赖
if [ ! -d "node_modules" ]; then
    echo "📥 安装依赖包..."
    npm install --production
fi

# 创建必要的目录
mkdir -p log img

# 启动服务器
echo "🎯 启动服务器..."
node server.js
