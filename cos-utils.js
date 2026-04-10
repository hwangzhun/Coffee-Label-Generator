/**
 * 腾讯云COS工具函数
 * 用于生成签名URL以访问私有COS资源
 */

class COSUtils {
    constructor() {
        this.cos = null;
        this.initCOS();
    }

    /**
     * 初始化COS实例
     */
    initCOS() {
        const config = window.CDN_CONFIG;
        
        // 如果未启用签名访问，直接返回
        if (!config.cos || !config.cos.useSignature) {
            window.logger?.log('COS签名访问未启用');
            return;
        }

        // 检查是否已加载COS SDK
        if (typeof COS === 'undefined') {
            window.logger?.error('COS SDK未加载，请检查CDN链接');
            return;
        }

        // 检查密钥是否配置
        if (!config.cos.SecretId || !config.cos.SecretKey || 
            config.cos.SecretId === 'YOUR_SECRET_ID' || 
            config.cos.SecretKey === 'YOUR_SECRET_KEY') {
            window.logger?.error('COS密钥未正确配置，请检查config.js');
            return;
        }

        try {
            // 初始化COS实例
            this.cos = new COS({
                SecretId: config.cos.SecretId,
                SecretKey: config.cos.SecretKey,
            });
            window.logger?.log('COS实例初始化成功', {
                bucket: config.cos.Bucket,
                region: config.cos.Region
            });
        } catch (error) {
            window.logger?.error('COS实例初始化失败:', error);
        }
    }

    /**
     * 从完整URL中提取对象键（Key）
     * @param {string} url - COS对象的完整URL
     * @returns {string} 对象键（解码后的）
     */
    extractKeyFromUrl(url) {
        try {
            const urlObj = new URL(url);
            // 移除开头的斜杠，COS的Key不应该以斜杠开头
            let key = urlObj.pathname;
            if (key.startsWith('/')) {
                key = key.substring(1);
            }
            
            // COS SDK的getObjectUrl方法需要的是解码后的Key
            // 尝试解码URL编码的字符
            try {
                key = decodeURIComponent(key);
            } catch (e) {
                // 如果解码失败（可能包含特殊字符），使用原始key
                window.logger?.warn('URL解码失败，使用原始key:', key, e);
            }
            
            return key;
        } catch (error) {
            window.logger?.error('解析URL失败:', error, url);
            // 如果URL解析失败，尝试直接提取路径部分
            try {
                const match = url.match(/\.myqcloud\.com\/(.+)$/);
                if (match && match[1]) {
                    try {
                        return decodeURIComponent(match[1]);
                    } catch (e) {
                        return match[1];
                    }
                }
            } catch (e) {
                window.logger?.error('备用URL解析也失败:', e);
            }
            return url;
        }
    }

    /**
     * 生成签名URL
     * @param {string} url - COS对象的完整URL或对象键
     * @param {number} expires - 签名有效期（秒），默认1小时
     * @returns {Promise<string>} 签名URL
     */
    async getSignedUrl(url, expires = null) {
        const config = window.CDN_CONFIG;
        
        // 如果未启用签名访问，直接返回原URL
        if (!config.cos || !config.cos.useSignature) {
            return url;
        }

        // 如果COS实例未初始化，返回原URL
        if (!this.cos) {
            window.logger?.warn('COS实例未初始化，返回原URL');
            return url;
        }

        try {
            // 提取对象键
            const key = this.extractKeyFromUrl(url);
            
            // 调试信息
            window.logger?.log('生成签名URL:', {
                originalUrl: url,
                extractedKey: key,
                bucket: config.cos.Bucket,
                region: config.cos.Region
            });
            
            // 使用配置的过期时间，如果没有则使用默认值
            const expiresTime = expires || config.cos.Expires || 3600;

            // 生成签名URL
            const signedUrl = await new Promise((resolve, reject) => {
                const params = {
                    Bucket: config.cos.Bucket,
                    Region: config.cos.Region,
                    Key: key,
                    Expires: expiresTime,
                    Sign: true
                };
                
                window.logger?.log('调用COS getObjectUrl，参数:', params);
                
                this.cos.getObjectUrl(params, (err, data) => {
                    if (err) {
                        window.logger?.error('生成签名URL失败:', {
                            error: err,
                            errorCode: err.statusCode,
                            errorMessage: err.message,
                            key: key,
                            keyLength: key.length,
                            bucket: config.cos.Bucket,
                            region: config.cos.Region
                        });
                        reject(err);
                    } else {
                        window.logger?.log('签名URL生成成功:', {
                            originalUrl: url,
                            signedUrl: data.Url,
                            key: key
                        });
                        resolve(data.Url);
                    }
                });
            });

            return signedUrl;
        } catch (error) {
            window.logger?.error('生成签名URL时出错:', error, url);
            // 出错时抛出错误，让调用者知道签名失败
            throw error;
        }
    }

    /**
     * 批量生成签名URL
     * @param {Array<string>} urls - URL数组
     * @param {number} expires - 签名有效期（秒）
     * @returns {Promise<Array<string>>} 签名URL数组
     */
    async getSignedUrls(urls, expires = null) {
        const promises = urls.map(url => this.getSignedUrl(url, expires));
        return Promise.all(promises);
    }

    /**
     * 列出COS目录下的所有图片文件
     * @param {string} prefix - 目录前缀，如 'cafecard.hwangzhun.com/'
     * @returns {Promise<Array>} 文件列表
     */
    async listImages(prefix = '') {
        const config = window.CDN_CONFIG;
        
        if (!this.cos) {
            throw new Error('COS实例未初始化');
        }

        return new Promise((resolve, reject) => {
            const params = {
                Bucket: config.cos.Bucket,
                Region: config.cos.Region,
                Prefix: prefix,
                MaxKeys: 1000 // 最多返回1000个文件
            };

            window.logger?.log('列出COS文件，参数:', params);

            this.cos.getBucket(params, (err, data) => {
                if (err) {
                    window.logger?.error('列出COS文件失败:', err);
                    reject(err);
                } else {
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
                            // 移除文件扩展名作为默认显示名称
                            const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));
                            
                            return {
                                key: key,
                                filename: nameWithoutExt,
                                url: `https://${config.cos.Bucket}.cos.${config.cos.Region}.myqcloud.com/${key}`
                            };
                        });

                    window.logger?.log(`找到 ${images.length} 张图片`);
                    resolve(images);
                }
            });
        });
    }
}

// 创建全局实例
window.cosUtils = new COSUtils();

