/**
 * 日志工具函数
 * 根据配置控制控制台日志输出
 */

class Logger {
    constructor() {
        this.config = window.CDN_CONFIG?.debug || { enabled: true, level: 'all' };
    }

    /**
     * 检查是否应该输出日志
     * @param {string} level - 日志级别：'log' | 'warn' | 'error'
     * @returns {boolean}
     */
    shouldLog(level) {
        if (!this.config.enabled) {
            return false;
        }

        const logLevel = this.config.level || 'all';

        if (logLevel === 'none') {
            return false;
        }

        if (logLevel === 'all') {
            return true;
        }

        if (logLevel === 'warn') {
            return level === 'warn' || level === 'error';
        }

        if (logLevel === 'error') {
            return level === 'error';
        }

        return true;
    }

    /**
     * 输出普通日志
     */
    log(...args) {
        if (this.shouldLog('log')) {
            console.log(...args);
        }
    }

    /**
     * 输出警告日志
     */
    warn(...args) {
        if (this.shouldLog('warn')) {
            console.warn(...args);
        }
    }

    /**
     * 输出错误日志
     */
    error(...args) {
        if (this.shouldLog('error')) {
            console.error(...args);
        }
    }
}

// 创建全局日志实例
window.logger = new Logger();

