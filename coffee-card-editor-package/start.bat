@echo off
echo 🚀 启动咖啡名片编辑器...

REM 检查Node.js是否安装
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js未安装，请先安装Node.js
    pause
    exit /b 1
)

REM 检查依赖是否安装
if not exist "node_modules" (
    echo 📦 安装依赖...
    npm install
)

REM 创建日志目录
if not exist "logs" mkdir logs

REM 启动服务
echo 🌟 启动服务...
node server.js
pause
