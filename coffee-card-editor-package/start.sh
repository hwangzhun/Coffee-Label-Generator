#!/bin/bash
echo "🚀 启动咖啡名片编辑器..."

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js未安装，请先安装Node.js"
    exit 1
fi

# 检查依赖是否安装
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 创建日志目录
mkdir -p logs

# 启动服务
echo "🌟 启动服务..."
node server.js
