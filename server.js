const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 设置静态文件的Cache-Control头
app.use(express.static('.', {
    setHeaders: (res, path) => {
        // 根据文件类型设置不同的缓存策略
        if (path.endsWith('.html')) {
            // HTML文件不缓存，确保用户总是获取最新版本
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
        } else if (path.endsWith('.js') || path.endsWith('.css')) {
            // 开发模式下不缓存JS和CSS文件，生产模式下缓存1小时
            if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
                res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
                res.setHeader('Pragma', 'no-cache');
                res.setHeader('Expires', '0');
            } else {
                res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
            }
        } else if (path.endsWith('.png') || path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.gif') || path.endsWith('.svg')) {
            // 图片文件缓存1天
            res.setHeader('Cache-Control', 'public, max-age=86400');
        } else {
            // 其他文件默认缓存1小时
            res.setHeader('Cache-Control', 'public, max-age=3600');
        }
    }
}));

// 确保log文件夹存在
const logDir = path.join(__dirname, 'log');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// 不再需要img文件夹，现在完全依赖CDN

// 保存log文件的API
app.post('/api/save-log', (req, res) => {
    // 设置API响应不缓存
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    try {
        const { filename, content, logData } = req.body;
        
        // 验证数据
        if (!filename || !content) {
            return res.status(400).json({ 
                success: false, 
                message: '缺少必要参数' 
            });
        }
        
        // 确保文件名安全
        const safeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
        const logFilePath = path.join(logDir, safeFilename);
        
        // 写入文件
        fs.writeFileSync(logFilePath, content, 'utf8');
        
        // 记录服务器日志
        console.log(`Log文件已保存: ${safeFilename}`);
        console.log(`文件路径: ${logFilePath}`);
        console.log(`文件大小: ${content.length} 字符`);
        
        // 返回成功响应
        res.json({
            success: true,
            message: 'Log文件保存成功',
            filename: safeFilename,
            path: logFilePath,
            size: content.length
        });
        
    } catch (error) {
        console.error('保存log文件时出错:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误',
            error: error.message
        });
    }
});

// 获取log文件列表的API
app.get('/api/logs', (req, res) => {
    // 设置API响应不缓存
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    try {
        const files = fs.readdirSync(logDir)
            .filter(file => file.endsWith('.log'))
            .map(file => {
                const filePath = path.join(logDir, file);
                const stats = fs.statSync(filePath);
                return {
                    filename: file,
                    size: stats.size,
                    created: stats.birthtime,
                    modified: stats.mtime
                };
            })
            .sort((a, b) => b.modified - a.modified); // 按修改时间倒序
        
        res.json({
            success: true,
            logs: files
        });
        
    } catch (error) {
        console.error('获取log文件列表时出错:', error);
        res.status(500).json({
            success: false,
            message: '获取log文件列表失败',
            error: error.message
        });
    }
});

// 下载log文件的API
app.get('/api/logs/:filename', (req, res) => {
    // 设置下载文件不缓存
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    try {
        const filename = req.params.filename;
        const safeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
        const logFilePath = path.join(logDir, safeFilename);
        
        if (!fs.existsSync(logFilePath)) {
            return res.status(404).json({
                success: false,
                message: 'Log文件不存在'
            });
        }
        
        res.download(logFilePath, safeFilename);
        
    } catch (error) {
        console.error('下载log文件时出错:', error);
        res.status(500).json({
            success: false,
            message: '下载log文件失败',
            error: error.message
        });
    }
});

// 图片API已移除，现在完全依赖CDN获取图片

// 启动服务器
app.listen(PORT, () => {
    console.log(`咖啡名片编辑器服务器已启动`);
    console.log(`访问地址: http://localhost:${PORT}`);
    console.log(`Log文件夹: ${logDir}`);
    console.log('='.repeat(50));
});

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n正在关闭服务器...');
    process.exit(0);
});
