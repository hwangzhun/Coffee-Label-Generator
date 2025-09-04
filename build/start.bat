@echo off
echo 🚀 启动咖啡名片编辑器服务器...
echo 📁 工作目录: %CD%
echo 🌐 访问地址: http://localhost:3000
echo ==================================================

REM 检查Node.js版本
node -v
echo.

REM 安装依赖
if not exist "node_modules" (
    echo 📥 安装依赖包...
    npm install --production
)

REM 创建必要的目录
if not exist "log" mkdir log
if not exist "img" mkdir img

REM 启动服务器
echo 🎯 启动服务器...
node server.js
pause
