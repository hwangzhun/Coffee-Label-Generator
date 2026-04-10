/**
 * COS签名URL生成服务（后端）
 * 密钥保存在服务器端，前端通过API获取签名URL
 */

const COS = require('cos-nodejs-sdk-v5');
const express = require('express');
const router = express.Router();

// 从环境变量读取COS配置
const cosConfig = {
    SecretId: process.env.COS_SECRET_ID || '',
    SecretKey: process.env.COS_SECRET_KEY || '',
    Bucket: process.env.COS_BUCKET || 'blog-data-1306368489',
    Region: process.env.COS_REGION || 'ap-guangzhou',
    Expires: parseInt(process.env.COS_EXPIRES || '3600', 10)
};

// 初始化COS实例
let cos = null;
if (cosConfig.SecretId && cosConfig.SecretKey) {
    cos = new COS({
        SecretId: cosConfig.SecretId,
        SecretKey: cosConfig.SecretKey
    });
    console.log('COS实例初始化成功');
} else {
    console.warn('COS配置未设置，请设置环境变量：COS_SECRET_ID, COS_SECRET_KEY');
}

/**
 * 生成签名URL
 * POST /api/cos/signed-url
 * Body: { url: "完整URL或对象Key" }
 */
router.post('/signed-url', (req, res) => {
    if (!cos) {
        return res.status(500).json({
            success: false,
            message: 'COS服务未配置'
        });
    }

    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({
                success: false,
                message: '缺少url参数'
            });
        }

        // 从URL中提取对象Key
        let key = url;
        try {
            const urlObj = new URL(url);
            key = urlObj.pathname;
            if (key.startsWith('/')) {
                key = key.substring(1);
            }
            // 解码URL编码
            key = decodeURIComponent(key);
        } catch (e) {
            // 如果解析失败，假设传入的就是Key
            key = url;
        }

        // 生成签名URL
        cos.getObjectUrl({
            Bucket: cosConfig.Bucket,
            Region: cosConfig.Region,
            Key: key,
            Expires: cosConfig.Expires,
            Sign: true
        }, (err, data) => {
            if (err) {
                console.error('生成签名URL失败:', err);
                return res.status(500).json({
                    success: false,
                    message: '生成签名URL失败',
                    error: err.message
                });
            }

            res.json({
                success: true,
                signedUrl: data.Url,
                expires: cosConfig.Expires
            });
        });
    } catch (error) {
        console.error('处理签名URL请求时出错:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误',
            error: error.message
        });
    }
});

/**
 * 批量生成签名URL
 * POST /api/cos/signed-urls
 * Body: { urls: ["url1", "url2", ...] }
 */
router.post('/signed-urls', async (req, res) => {
    if (!cos) {
        return res.status(500).json({
            success: false,
            message: 'COS服务未配置'
        });
    }

    try {
        const { urls } = req.body;
        
        if (!urls || !Array.isArray(urls)) {
            return res.status(400).json({
                success: false,
                message: '缺少urls参数或格式错误'
            });
        }

        // 批量生成签名URL
        const promises = urls.map(url => {
            return new Promise((resolve, reject) => {
                let key = url;
                try {
                    const urlObj = new URL(url);
                    key = urlObj.pathname;
                    if (key.startsWith('/')) {
                        key = key.substring(1);
                    }
                    key = decodeURIComponent(key);
                } catch (e) {
                    key = url;
                }

                cos.getObjectUrl({
                    Bucket: cosConfig.Bucket,
                    Region: cosConfig.Region,
                    Key: key,
                    Expires: cosConfig.Expires,
                    Sign: true
                }, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data.Url);
                    }
                });
            });
        });

        const signedUrls = await Promise.all(promises);
        
        res.json({
            success: true,
            signedUrls: signedUrls,
            expires: cosConfig.Expires
        });
    } catch (error) {
        console.error('批量生成签名URL失败:', error);
        res.status(500).json({
            success: false,
            message: '批量生成签名URL失败',
            error: error.message
        });
    }
});

/**
 * 列出COS目录文件
 * POST /api/cos/list
 * Body: { prefix: "目录前缀" }
 */
router.post('/list', (req, res) => {
    if (!cos) {
        return res.status(500).json({
            success: false,
            message: 'COS服务未配置'
        });
    }

    try {
        const { prefix = '' } = req.body;

        cos.getBucket({
            Bucket: cosConfig.Bucket,
            Region: cosConfig.Region,
            Prefix: prefix,
            MaxKeys: 1000
        }, (err, data) => {
            if (err) {
                console.error('列出COS文件失败:', err);
                return res.status(500).json({
                    success: false,
                    message: '列出COS文件失败',
                    error: err.message
                });
            }

            // 过滤出图片文件
            const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp'];
            const images = (data.Contents || [])
                .filter(item => {
                    const key = item.Key || '';
                    const ext = key.substring(key.lastIndexOf('.')).toLowerCase();
                    return imageExtensions.includes(ext);
                })
                .map(item => {
                    const key = item.Key || '';
                    const filename = key.substring(key.lastIndexOf('/') + 1);
                    const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));
                    
                    return {
                        key: key,
                        filename: nameWithoutExt,
                        url: `https://${cosConfig.Bucket}.cos.${cosConfig.Region}.myqcloud.com/${key}`
                    };
                });

            res.json({
                success: true,
                images: images,
                count: images.length
            });
        });
    } catch (error) {
        console.error('列出COS文件时出错:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误',
            error: error.message
        });
    }
});

module.exports = router;

