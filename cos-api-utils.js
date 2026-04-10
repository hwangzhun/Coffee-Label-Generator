/**
 * COS API工具函数（前端）
 * 通过后端API获取签名URL，不直接使用密钥
 */

class COSApiUtils {
    constructor() {
        this.apiBase = '/api/cos';
    }

    /**
     * 生成签名URL（通过后端API）
     * @param {string} url - COS对象的完整URL
     * @returns {Promise<string>} 签名URL
     */
    async getSignedUrl(url) {
        try {
            const response = await fetch(`${this.apiBase}/signed-url`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || '生成签名URL失败');
            }

            return data.signedUrl;
        } catch (error) {
            window.logger?.error('通过API生成签名URL失败:', error);
            throw error;
        }
    }

    /**
     * 批量生成签名URL
     * @param {Array<string>} urls - URL数组
     * @returns {Promise<Array<string>>} 签名URL数组
     */
    async getSignedUrls(urls) {
        try {
            const response = await fetch(`${this.apiBase}/signed-urls`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ urls })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || '批量生成签名URL失败');
            }

            return data.signedUrls;
        } catch (error) {
            window.logger?.error('通过API批量生成签名URL失败:', error);
            throw error;
        }
    }

    /**
     * 列出COS目录下的图片文件
     * @param {string} prefix - 目录前缀
     * @returns {Promise<Array>} 文件列表
     */
    async listImages(prefix = '') {
        try {
            const response = await fetch(`${this.apiBase}/list`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prefix })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || '列出COS文件失败');
            }

            return data.images;
        } catch (error) {
            window.logger?.error('通过API列出COS文件失败:', error);
            throw error;
        }
    }
}

// 创建全局实例
window.cosApiUtils = new COSApiUtils();

