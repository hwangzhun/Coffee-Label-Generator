# PDF信息显示优化说明

## 修改内容

### 1. HTML结构修改

**修改位置**：`index.html` 第165-194行

**修改前**：
```html
<div class="pdf-info">
    <div class="info-item">
        <span class="info-label">选中图片：</span>
        <span id="pdfImageCount">0</span> 张
    </div>
    <div class="info-item">
        <span class="info-label">每张数量：</span>
        <span id="pdfQuantityPerImage">0</span> 张
    </div>
    <div class="info-item">
        <span class="info-label">总数量：</span>
        <span id="pdfTotalQuantity">0</span> 张
    </div>
    <div class="info-item">
        <span class="info-label">烘焙日期：</span>
        <span id="pdfBakingDate">无</span>
    </div>
    <div class="info-item">
        <span class="info-label">重量：</span>
        <span id="pdfWeight">无</span>
    </div>
</div>
```

**修改后**：
```html
<div class="pdf-info">
    <div class="info-item">
        <span class="info-label">选中图片：</span>
        <span id="pdfImageCount">0</span> 张
    </div>
    <div class="info-item">
        <span class="info-label">总数量：</span>
        <span id="pdfTotalQuantity">0</span> 张
    </div>
    <div class="info-item-full">
        <span class="info-label">咖啡详情：</span>
        <div class="coffee-details" id="pdfCoffeeDetails">
            <table class="coffee-table">
                <thead>
                    <tr>
                        <th>咖啡名称</th>
                        <th>重量</th>
                        <th>烘焙日期</th>
                        <th>张数</th>
                    </tr>
                </thead>
                <tbody id="coffeeTableBody">
                    <tr>
                        <td colspan="4" class="no-data">请先生成PDF查看详情</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
```

### 2. CSS样式添加

**修改位置**：`style.css` 第1011-1106行

**新增样式**：
```css
.info-item-full {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
}

.coffee-details {
    background: rgba(255, 255, 255, 0.1);
    padding: 12px;
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    font-size: 14px;
    line-height: 1.6;
    color: #4a5568;
    max-height: 200px;
    overflow-y: auto;
    width: 100%;
}

.coffee-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.coffee-table thead {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.coffee-table th {
    padding: 12px 8px;
    text-align: left;
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.coffee-table td {
    padding: 10px 8px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    vertical-align: middle;
}

.coffee-table tbody tr:hover {
    background: rgba(102, 126, 234, 0.05);
    transition: background-color 0.2s ease;
}

.coffee-table .coffee-name {
    font-weight: 600;
    color: #2d3748;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.coffee-table .weight {
    color: #667eea;
    font-weight: 500;
}

.coffee-table .baking-date {
    color: #38a169;
    font-weight: 500;
    font-size: 12px;
}

.coffee-table .quantity {
    color: #e53e3e;
    font-weight: 600;
    text-align: center;
    background: rgba(229, 62, 62, 0.1);
    border-radius: 4px;
    padding: 2px 6px;
    display: inline-block;
    min-width: 30px;
}
```

### 3. JavaScript功能修改

#### 3.1 移除不再使用的DOM元素引用

**修改位置**：`script.js` 第48-54行

**移除的元素**：
- `pdfQuantityPerImage`
- `pdfBakingDate`
- `pdfWeight`

#### 3.2 修改 `updateStep4()` 函数

**修改位置**：`script.js` 第701-710行

**修改前**：
```javascript
updateStep4() {
    const totalQuantity = this.selectedImages.reduce((sum, selection) => sum + selection.quantity, 0);
    this.pdfImageCount.textContent = this.selectedImages.length;
    this.pdfQuantityPerImage.textContent = Math.round(totalQuantity / this.selectedImages.length);
    this.pdfTotalQuantity.textContent = totalQuantity;
    if (this.settingMode === 'global') {
        this.pdfBakingDate.textContent = this.formatBakingDate(this.globalBakingDate) || '无';
        this.pdfWeight.textContent = this.formatWeight(this.globalWeight) || '无';
    } else {
        this.pdfBakingDate.textContent = '单独设定';
        this.pdfWeight.textContent = '单独设定';
    }
    
    this.downloadPdf.disabled = !this.generatedPdf;
}
```

**修改后**：
```javascript
updateStep4() {
    const totalQuantity = this.selectedImages.reduce((sum, selection) => sum + selection.quantity, 0);
    this.pdfImageCount.textContent = this.selectedImages.length;
    this.pdfTotalQuantity.textContent = totalQuantity;
    
    // 生成咖啡详情
    this.updateCoffeeDetails();
    
    this.downloadPdf.disabled = !this.generatedPdf;
}
```

#### 3.3 新增 `updateCoffeeDetails()` 函数

**新增位置**：`script.js` 第709-765行

**功能**：
- 根据设定模式显示不同的咖啡详情
- 全局设定模式：显示统一的烘焙日期和重量
- 单独设定模式：显示每张图片的具体设定
- 使用表格形式展示，包含以下列：
  - 咖啡名称（带tooltip，超长时省略）
  - 重量（蓝色高亮）
  - 烘焙日期（绿色高亮）
  - 张数（红色背景标签）

#### 3.4 修改 `generatePDF()` 函数

**修改位置**：`script.js` 第815-816行

**新增功能**：
- 在处理每张图片后添加1秒延迟
- 提供更好的用户体验和进度反馈

```javascript
// 添加1秒延迟
await new Promise(resolve => setTimeout(resolve, 1000));
```

## 优化效果

### 1. 信息显示优化
- **更直观**：直接显示每张咖啡的具体信息
- **更详细**：包含咖啡名称、重量、烘焙日期、张数
- **更清晰**：区分全局设定和单独设定模式

### 2. 用户体验优化
- **进度反馈**：PDF生成时每张图片有1秒延迟，用户可以看到进度
- **信息完整**：显示所有选中咖啡的详细信息
- **格式统一**：使用统一的格式显示信息

### 3. 界面优化
- **简洁布局**：移除不必要的统计信息
- **重点突出**：咖啡详情区域更加突出
- **滚动支持**：详情区域支持滚动查看

## 显示格式示例

### 表格形式展示

| 咖啡名称 | 重量 | 烘焙日期 | 张数 |
|---------|------|----------|------|
| 耶加雪啡-哈露贝利蒂 | 800g | 2024年01月15日 | 3张 |
| 2015陈年曼特宁 | 500g | 2024年01月15日 | 2张 |

### 样式特点

1. **表头**：渐变背景（蓝紫色），白色文字，大写字母
2. **咖啡名称**：深色粗体，超长时省略显示，鼠标悬停显示完整名称
3. **重量**：蓝色高亮显示
4. **烘焙日期**：绿色高亮显示，较小字体
5. **张数**：红色背景标签，居中显示
6. **悬停效果**：行悬停时显示淡蓝色背景
7. **响应式**：支持滚动查看，最大高度200px

## 技术细节

### 数据来源
- **咖啡名称**：从 `availableImages` 获取
- **重量和日期**：从全局设定或单独设定获取
- **张数**：从选中图片的数量获取

### 延迟处理
- **延迟时间**：每张图片处理完成后等待1秒
- **异步处理**：使用 `Promise` 和 `setTimeout` 实现
- **进度更新**：延迟期间更新进度显示

### 样式设计
- **响应式布局**：支持不同屏幕尺寸
- **滚动支持**：详情过多时支持滚动查看
- **视觉层次**：使用不同的背景色和边框区分区域
