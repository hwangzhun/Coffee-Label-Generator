# CDN部署说明

## 文件结构

### 服务器端（保留）
```
项目根目录/
├── index.html
├── style.css
├── script.js
├── config.js          # CDN配置
├── server.js
├── package.json
└── img/               # 空目录，不再存储图片和配置
```

### CDN端（新增）
```
CDN根目录/
├── images.json        # 图片配置文件
└── images/            # 图片文件夹
    ├── 2015陈年曼特宁.jpg
    ├── 克里夫顿庄园-蓝山一号.jpg
    └── ... (其他图片)
```

## 部署步骤

### 1. 配置CDN地址

修改 `config.js` 文件：

```javascript
window.CDN_CONFIG = {
    // 替换为你的CDN域名
    baseUrl: 'https://your-cdn-domain.com',
    configPath: '/images.json',
    imageBasePath: '/images/',
    enabled: true
};
```

### 2. 上传文件到CDN

1. **上传图片配置文件**：
   - 将 `images-cdn.json` 重命名为 `images.json`
   - 上传到CDN根目录
   - 确保可以通过 `https://your-cdn-domain.com/images.json` 访问

2. **上传图片文件**：
   - 将所有图片文件上传到CDN的 `images/` 目录
   - 确保图片可以通过 `https://your-cdn-domain.com/images/图片名.jpg` 访问

### 3. 更新图片URL

在CDN的 `images.json` 文件中，将所有图片的 `url` 字段更新为实际的CDN地址：

```json
{
  "images": [
    {
      "name": "2015陈年曼特宁",
      "filename": "2015陈年曼特宁.jpg",
      "url": "https://your-actual-cdn.com/images/2015陈年曼特宁.jpg"
    }
  ]
}
```

### 4. 测试访问

确保以下URL可以正常访问：
- `https://your-cdn-domain.com/images.json`
- `https://your-cdn-domain.com/images/2015陈年曼特宁.jpg`

## 优势

1. **服务器负载减少**：图片和配置都托管在CDN
2. **全球加速**：CDN提供全球节点加速
3. **带宽节省**：减少服务器带宽消耗
4. **易于管理**：只需更新CDN上的配置文件
5. **高可用性**：CDN提供更好的可用性

## 注意事项

1. **CORS配置**：确保CDN支持跨域访问
2. **HTTPS**：建议使用HTTPS协议
3. **缓存策略**：配置合适的缓存策略
4. **备份**：定期备份CDN上的配置文件

## 故障排除

如果图片加载失败，检查：
1. CDN地址是否正确
2. 图片URL是否可访问
3. 网络连接是否正常
4. CORS配置是否正确
