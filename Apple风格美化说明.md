# PDF信息区域Apple风格美化说明

## 设计理念

采用Apple的现代设计语言，包括：
- **毛玻璃效果**：使用backdrop-filter实现半透明模糊效果
- **圆角设计**：使用较大的圆角半径（16px）
- **微妙阴影**：多层阴影营造深度感
- **系统色彩**：使用Apple官方色彩系统
- **优雅过渡**：平滑的动画和悬停效果

## 主要修改

### 1. PDF信息容器 (.pdf-info)

**修改前**：
```css
.pdf-info {
    background: #f7fafc;
    border-radius: 10px;
    padding: 25px;
    margin-bottom: 25px;
    border: 2px solid #e2e8f0;
}
```

**修改后**：
```css
.pdf-info {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.1),
        0 1px 0 rgba(255, 255, 255, 0.2) inset;
    position: relative;
    overflow: hidden;
}
```

**Apple风格特点**：
- ✅ 毛玻璃背景效果
- ✅ 更大的圆角半径
- ✅ 多层阴影营造深度
- ✅ 顶部高光效果
- ✅ 半透明边框

### 2. 信息项 (.info-item)

**修改前**：
```css
.info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #e2e8f0;
}
```

**修改后**：
```css
.info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;
    position: relative;
}

.info-item:hover {
    background: rgba(0, 0, 0, 0.02);
    border-radius: 8px;
    margin: 0 -8px;
    padding: 12px 8px;
}
```

**Apple风格特点**：
- ✅ 微妙的悬停效果
- ✅ 平滑的过渡动画
- ✅ 更柔和的边框颜色
- ✅ 悬停时的背景变化

### 3. 标签样式 (.info-label)

**修改前**：
```css
.info-label {
    font-weight: 600;
    color: #4a5568;
}
```

**修改后**：
```css
.info-label {
    font-weight: 500;
    color: #1d1d1f;
    font-size: 15px;
    letter-spacing: -0.01em;
}
```

**Apple风格特点**：
- ✅ 使用Apple系统字体颜色
- ✅ 负字间距提升可读性
- ✅ 适中的字重

### 4. 数值显示

**修改前**：
```css
.info-item span:last-child {
    color: #667eea;
    font-weight: 600;
}
```

**修改后**：
```css
.info-item span:last-child {
    color: #007aff;
    font-weight: 600;
    font-size: 15px;
    background: rgba(0, 122, 255, 0.1);
    padding: 4px 12px;
    border-radius: 20px;
    border: 1px solid rgba(0, 122, 255, 0.2);
}
```

**Apple风格特点**：
- ✅ 使用Apple蓝色 (#007aff)
- ✅ 胶囊形状的背景
- ✅ 半透明背景和边框

### 5. 咖啡详情表格

**表头样式**：
```css
.coffee-table thead {
    background: rgba(0, 0, 0, 0.03);
    color: #1d1d1f;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.coffee-table th {
    padding: 16px 12px;
    text-align: left;
    font-weight: 600;
    font-size: 13px;
    color: #86868b;
    letter-spacing: -0.01em;
    border-bottom: none;
}
```

**表格行样式**：
```css
.coffee-table td {
    padding: 14px 12px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
    vertical-align: middle;
    transition: background-color 0.15s ease;
}

.coffee-table tbody tr:hover {
    background: rgba(0, 0, 0, 0.02);
}
```

**颜色系统**：
- **咖啡名称**：`#1d1d1f` (Apple深色)
- **重量**：`#007aff` (Apple蓝色)
- **烘焙日期**：`#34c759` (Apple绿色)
- **张数**：`#ff3b30` (Apple红色)

## 视觉效果

### 1. 毛玻璃效果
- 使用 `backdrop-filter: blur(20px)` 实现背景模糊
- 半透明背景 `rgba(255, 255, 255, 0.8)`
- 顶部高光效果增强立体感

### 2. 阴影系统
- 主阴影：`0 8px 32px rgba(0, 0, 0, 0.1)`
- 内阴影：`0 1px 0 rgba(255, 255, 255, 0.2) inset`
- 表格阴影：`0 2px 8px rgba(0, 0, 0, 0.04)`

### 3. 圆角设计
- 主容器：`16px`
- 信息项悬停：`8px`
- 数值标签：`20px`
- 表格单元格：`8px`

### 4. 动画效果
- 悬停过渡：`0.2s ease`
- 背景色过渡：`0.15s ease`
- 平滑的交互反馈

## 响应式设计

### 字体大小
- 标签：`15px`
- 数值：`15px`
- 表格内容：`14px`
- 表格标题：`13px`

### 间距系统
- 容器内边距：`24px`
- 信息项内边距：`12px`
- 表格单元格内边距：`14px 12px`

### 颜色对比度
- 确保所有文本符合WCAG AA标准
- 使用Apple官方色彩系统
- 保持良好的可读性

## 兼容性

### 浏览器支持
- Safari：完全支持
- Chrome：支持backdrop-filter
- Firefox：支持backdrop-filter
- Edge：支持backdrop-filter

### 降级方案
- 不支持backdrop-filter的浏览器会显示纯色背景
- 保持所有功能正常工作

## 总结

通过这次美化，PDF信息区域现在具有：
- ✅ 现代Apple风格设计
- ✅ 毛玻璃视觉效果
- ✅ 优雅的交互反馈
- ✅ 系统级色彩方案
- ✅ 优秀的可读性
- ✅ 完美的视觉层次
