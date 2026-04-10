// CDN配置
window.CDN_CONFIG = {
    // CDN基础地址 - 请替换为你的CDN域名
    baseUrl: 'https://blog-data-1306368489.cos.ap-guangzhou.myqcloud.com/cafecard.hwangzhun.com',
    
    // 图片基础路径
    imageBasePath: '/',
    
    // 是否启用CDN
    enabled: true,
    
    // 日志配置
    debug: {
        // 是否启用控制台日志输出（开发时设为true，生产环境设为false）
        enabled: false,
        
        // 日志级别：'all' | 'warn' | 'error' | 'none'
        // 'all': 输出所有日志（log, warn, error）
        // 'warn': 只输出警告和错误（warn, error）
        // 'error': 只输出错误（error）
        // 'none': 不输出任何日志
        level: 'warn, error'
    },
    
    // 自动扫描配置
    autoScan: {
        // COS目录前缀（相对于存储桶根目录）
        prefix: 'cafecard.hwangzhun.com/',
        
        // 名称映射文件路径（放在OSS上，用于配置显示名称，如果显示名称和文件名相同可省略）
        // 路径相对于 baseUrl，例如：'/name-mapping.json' 对应 'cafecard.hwangzhun.com/name-mapping.json'
        nameMappingPath: '/name-mapping.json'
    },
    
    // 腾讯云COS配置（用于私有读取）
    cos: {
        // 是否启用COS签名访问（私有读取时设为true）
        useSignature: true,
        
        // 使用后端API模式（推荐，密钥保存在服务器端）
        // 设为 true 时，通过后端API获取签名URL，密钥不会暴露在前端
        // 设为 false 时，使用前端SDK直接生成签名URL（密钥会暴露，不推荐）
        useBackendApi: true,
        
        // 以下配置仅在 useBackendApi 为 false 时使用
        // 如果使用后端API模式，这些配置会被忽略
        SecretId: window.CDN_CONFIG_LOCAL?.cos?.SecretId || 'YOUR_SECRET_ID',
        SecretKey: window.CDN_CONFIG_LOCAL?.cos?.SecretKey || 'YOUR_SECRET_KEY',
        Bucket: window.CDN_CONFIG_LOCAL?.cos?.Bucket || 'blog-data-1306368489',
        Region: window.CDN_CONFIG_LOCAL?.cos?.Region || 'ap-guangzhou',
        
        // 签名URL有效期（秒），默认1小时
        Expires: 3600
    }
};