class PaginatedCoffeeCardEditor {
    constructor() {
        this.currentStep = 1;
        this.availableImages = [];
        this.searchKeyword = '';
        this.selectedImages = []; // 存储 {index, quantity} 对象
        this.settingMode = 'global'; // 'global' 或 'individual'
        this.globalBakingDate = '';
        this.globalWeight = '';
        this.individualSettingsData = {}; // 存储每张图片的单独设定 {index: {bakingDate, weight, copies: [{bakingDate, weight}]}}
        this.processedImages = [];
        this.generatedPdf = null;
        
        this.initializeElements();
        this.bindEvents();
        this.initializeDefaultValues();
        this.loadFonts(); // 先加载字体
        this.loadAvailableImages();
    }

    initializeElements() {
        // 页面元素
        this.pages = document.querySelectorAll('.page');
        this.progressSteps = document.querySelectorAll('.progress-step');
        
        // 第一页元素
        this.imageGrid = document.getElementById('imageGrid');
        this.imageSearchInput = document.getElementById('imageSearchInput');
        this.imageFilterResetBtn = document.getElementById('imageFilterResetBtn');
        this.nextToStep2 = document.getElementById('nextToStep2');
        
        // 第二页元素
        this.selectedImagesList = document.getElementById('selectedImagesList');
        this.totalQuantity = document.getElementById('totalQuantity');
        this.prevToStep1 = document.getElementById('prevToStep1');
        this.nextToStep3 = document.getElementById('nextToStep3');
        
        // 第三页元素
        this.settingModeRadios = document.querySelectorAll('input[name="settingMode"]');
        this.globalSettings = document.getElementById('globalSettings');
        this.individualSettings = document.getElementById('individualSettings');
        this.globalBakingDateInput = document.getElementById('globalBakingDate');
        this.globalWeightInput = document.getElementById('globalWeight');
        this.individualImagesList = document.getElementById('individualImagesList');
        this.updatePreviewBtn = document.getElementById('updatePreview');
        this.previewImagesGrid = document.getElementById('previewImagesGrid');
        this.previewImageInfo = document.getElementById('previewImageInfo');
        this.previewQuantityInfo = document.getElementById('previewQuantityInfo');
        this.prevToStep2 = document.getElementById('prevToStep2');
        this.nextToStep4 = document.getElementById('nextToStep4');
        
        // 第四页元素
        this.pdfImageCount = document.getElementById('pdfImageCount');
        this.pdfTotalQuantity = document.getElementById('pdfTotalQuantity');
        this.generatePdf = document.getElementById('generatePdf');
        this.downloadPdf = document.getElementById('downloadPdf');
        this.prevToStep3 = document.getElementById('prevToStep3');
        this.restartProcess = document.getElementById('restartProcess');
        
        // 模态框元素
        this.imageModal = document.getElementById('imageModal');
        this.modalImage = document.getElementById('modalImage');
        this.modalImageName = document.getElementById('modalImageName');
        this.closeModal = document.getElementById('closeModal');
    }

    bindEvents() {
        // 第一页事件
        this.nextToStep2.addEventListener('click', () => this.goToStep(2));
        if (this.imageSearchInput) {
            this.imageSearchInput.addEventListener('input', (e) => {
                this.searchKeyword = e.target.value || '';
                this.renderImageGrid();
            });
        }
        if (this.imageFilterResetBtn) {
            this.imageFilterResetBtn.addEventListener('click', () => {
                this.searchKeyword = '';
                if (this.imageSearchInput) {
                    this.imageSearchInput.value = '';
                }
                this.renderImageGrid();
            });
        }
        
        // 第二页事件
        this.prevToStep1.addEventListener('click', () => this.goToStep(1));
        this.nextToStep3.addEventListener('click', () => this.goToStep(3));
        
        // 第三页事件
        this.prevToStep2.addEventListener('click', () => this.goToStep(2));
        this.nextToStep4.addEventListener('click', () => this.goToStep(4));
        // 设定模式切换
        this.settingModeRadios.forEach(radio => {
            radio.addEventListener('change', () => this.toggleSettingMode());
        });
        
        // 全局设定事件
        this.globalBakingDateInput.addEventListener('input', () => this.updateGlobalSettings());
        this.globalWeightInput.addEventListener('input', () => this.updateGlobalSettings());
        
        // 手动预览事件
        this.updatePreviewBtn.addEventListener('click', () => this.updatePreviewImages());
        
        // 第四页事件
        this.prevToStep3.addEventListener('click', () => this.goToStep(3));
        this.restartProcess.addEventListener('click', () => this.restart());
        this.generatePdf.addEventListener('click', () => this.generatePDF());
        this.downloadPdf.addEventListener('click', () => this.downloadPDF());
        
        // 模态框事件
        this.closeModal.addEventListener('click', () => this.closeImageModal());
        this.imageModal.addEventListener('click', (e) => {
            if (e.target === this.imageModal) {
                this.closeImageModal();
            }
        });
    }

    initializeDefaultValues() {
        // 设置默认日期为今天
        const today = new Date().toISOString().split('T')[0];
        this.globalBakingDateInput.value = today;
        this.globalBakingDate = today;
    }

    toggleSettingMode() {
        const selectedMode = document.querySelector('input[name="settingMode"]:checked').value;
        this.settingMode = selectedMode;
        
        if (selectedMode === 'global') {
            this.globalSettings.style.display = 'block';
            this.individualSettings.style.display = 'none';
        } else {
            this.globalSettings.style.display = 'none';
            this.individualSettings.style.display = 'block';
            this.renderIndividualSettings();
        }
        
        this.updatePreviewImages();
        this.updateStep3Buttons();
    }

    updateGlobalSettings() {
        this.globalBakingDate = this.globalBakingDateInput.value;
        this.globalWeight = this.globalWeightInput.value;
        this.updateStep3Buttons();
    }

    renderIndividualSettings() {
        this.individualImagesList.innerHTML = '';
        const today = new Date().toISOString().split('T')[0]; // 获取当天日期
        
        this.selectedImages.forEach((selection, listIndex) => {
            const image = this.availableImages[selection.index];
            const item = document.createElement('div');
            item.className = 'individual-image-item';
            
            // 初始化单独设定（如果还没有的话）
            if (!this.individualSettingsData[selection.index]) {
                this.individualSettingsData[selection.index] = {
                    bakingDate: this.globalBakingDate || today,
                    weight: this.globalWeight,
                    copies: []
                };
            }
            
            const individualSetting = this.individualSettingsData[selection.index];
            
            // 确保copies数组有足够的元素
            while (individualSetting.copies.length < selection.quantity) {
                individualSetting.copies.push({
                    bakingDate: individualSetting.bakingDate || this.globalBakingDate || today,
                    weight: individualSetting.weight || this.globalWeight
                });
            }
            
            // 如果数量减少了，移除多余的copies
            if (individualSetting.copies.length > selection.quantity) {
                individualSetting.copies = individualSetting.copies.slice(0, selection.quantity);
            }
            
            // 生成每个副本的输入框
            let copiesHtml = '';
            for (let copyIndex = 0; copyIndex < selection.quantity; copyIndex++) {
                const copy = individualSetting.copies[copyIndex];
                copiesHtml += `
                    <div class="copy-item">
                        <div class="copy-header">第 ${copyIndex + 1} 张</div>
                        <div class="copy-inputs">
                            <div class="individual-input-group">
                                <label>烘焙日期</label>
                                <input type="date" 
                                       value="${copy.bakingDate || today}" 
                                       data-index="${selection.index}"
                                       data-copy="${copyIndex}"
                                       data-field="bakingDate"
                                       title="实际添加格式：烘焙日期：年月日">
                            </div>
                            <div class="individual-input-group">
                                <label>重量</label>
                                <div class="individual-weight-wrapper">
                                    <input type="number" 
                                           value="${copy.weight || ''}" 
                                           data-index="${selection.index}"
                                           data-copy="${copyIndex}"
                                           data-field="weight"
                                           min="0" step="0.1">
                                    <span class="individual-weight-unit">g</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            item.innerHTML = `
                <img src="${image.data}" alt="${this.getDisplayName(image.name)}">
                <div class="individual-image-info">
                    <div class="image-name">${this.getDisplayName(image.name)}</div>
                    <div class="image-size">数量: ${selection.quantity} 张</div>
                </div>
                <div class="individual-copies-container">
                    ${copiesHtml}
                </div>
            `;
            
            // 绑定事件
            const inputs = item.querySelectorAll('input');
            inputs.forEach(input => {
                input.addEventListener('input', (e) => {
                    const index = parseInt(e.target.dataset.index);
                    const copyIndex = parseInt(e.target.dataset.copy);
                    const field = e.target.dataset.field;
                    const value = e.target.value;
                    
                    if (!this.individualSettingsData[index]) {
                        const today = new Date().toISOString().split('T')[0]; // 获取当天日期
                        this.individualSettingsData[index] = {
                            bakingDate: this.globalBakingDate || today,
                            weight: this.globalWeight,
                            copies: []
                        };
                    }
                    
                    if (!this.individualSettingsData[index].copies[copyIndex]) {
                        this.individualSettingsData[index].copies[copyIndex] = {
                            bakingDate: this.globalBakingDate || today,
                            weight: this.globalWeight
                        };
                    }
                    
                    this.individualSettingsData[index].copies[copyIndex][field] = value;
                    
                    this.updateStep3Buttons();
                });
            });
            
            this.individualImagesList.appendChild(item);
        });
    }

    /**
     * 加载字体文件（使用签名URL）
     */
    async loadFonts() {
        const config = window.CDN_CONFIG;
        const fontBaseUrl = config.baseUrl + '/fonts';
        
        // 字体文件路径
        const woff2Path = `${fontBaseUrl}/OPPO Sans 4.0.woff2`;
        const ttfPath = `${fontBaseUrl}/OPPO Sans 4.0.ttf`;
        
        try {
            let woff2Url = woff2Path;
            let ttfUrl = ttfPath;
            
            // 如果启用了COS签名访问，生成签名URL
            if (config.cos && config.cos.useSignature) {
                try {
                    // 根据配置选择使用后端API或前端SDK
                    if (config.cos.useBackendApi && window.cosApiUtils) {
                        // 使用后端API（推荐，密钥不暴露）
                        woff2Url = await window.cosApiUtils.getSignedUrl(woff2Path);
                        ttfUrl = await window.cosApiUtils.getSignedUrl(ttfPath);
                    } else if (window.cosUtils) {
                        // 使用前端SDK（密钥会暴露，不推荐）
                        woff2Url = await window.cosUtils.getSignedUrl(woff2Path);
                        ttfUrl = await window.cosUtils.getSignedUrl(ttfPath);
                    }
                    window.logger?.log('字体签名URL生成成功');
                } catch (error) {
                    window.logger?.warn('生成字体签名URL失败，使用原URL:', error);
                }
            }
            
            // 动态创建@font-face规则
            const fontFaceRule = `@font-face {
    font-family: 'OPPO Sans 4.0';
    src: url("${woff2Url}") format('woff2'),
         url("${ttfUrl}") format('opentype');
    font-display: swap;
}`;
            
            // 创建style标签并注入到head
            const style = document.createElement('style');
            style.textContent = fontFaceRule;
            document.head.appendChild(style);
            
            window.logger?.log('字体 OPPO Sans 4.0 加载成功');
        } catch (error) {
            window.logger?.error('加载字体失败:', error);
        }
    }

    /**
     * 批量失败时回退到逐个生成签名URL
     * @param {Array} batch - 当前批次的图片配置
     * @param {number} batchIndex - 当前批次索引
     * @param {number} totalBatches - 总批次数
     * @param {number} totalImages - 总图片数
     * @returns {Promise<Array<string>>} 签名URL数组
     */
    async fallbackToIndividualSigning(batch, batchIndex, totalBatches, totalImages) {
        window.logger?.warn(`批次 ${batchIndex + 1} 批量生成失败，回退到逐个生成`);
        const signedUrls = [];
        
        for (let i = 0; i < batch.length; i++) {
            const imageConfig = batch[i];
            try {
                let signedUrl = imageConfig.url;
                
                if (window.CDN_CONFIG.cos.useBackendApi && window.cosApiUtils) {
                    signedUrl = await window.cosApiUtils.getSignedUrl(imageConfig.url);
                } else if (window.cosUtils) {
                    signedUrl = await window.cosUtils.getSignedUrl(imageConfig.url);
                }
                
                signedUrls.push(signedUrl);
            } catch (error) {
                window.logger?.error(`逐个生成签名URL失败: ${imageConfig.filename}`, error);
                signedUrls.push(imageConfig.url); // 失败时使用原始URL
            }
        }
        
        return signedUrls;
    }

    /**
     * 更新加载进度显示
     * @param {number} percentage - 进度百分比 (0-100)
     * @param {string} stage - 当前阶段描述
     * @param {number} current - 当前处理的图片数量
     * @param {number} total - 总图片数量
     */
    updateLoadingProgress(percentage, stage, current = 0, total = 0) {
        const progressContainer = this.imageGrid.querySelector('.loading-progress-container');
        if (!progressContainer) return;
        
        const progressBarFill = progressContainer.querySelector('.progress-bar-fill');
        const progressPercentage = progressContainer.querySelector('.progress-percentage');
        const progressStage = progressContainer.querySelector('.progress-stage');
        const progressCount = progressContainer.querySelector('.progress-count');
        
        if (progressBarFill) {
            progressBarFill.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
        }
        
        if (progressPercentage) {
            progressPercentage.textContent = `${Math.round(percentage)}%`;
        }
        
        if (progressStage) {
            progressStage.textContent = stage;
        }
        
        if (progressCount) {
            if (total > 0) {
                progressCount.textContent = `${current}/${total} 张图片`;
            } else {
                progressCount.textContent = '';
            }
        }
    }

    async loadAvailableImages() {
        // 初始化进度条
        this.imageGrid.innerHTML = `
            <div class="loading-progress-container">
                <div class="progress-bar-wrapper">
                    <div class="progress-bar-fill" style="width: 0%"></div>
                </div>
                <div class="progress-info">
                    <span class="progress-percentage">0%</span>
                    <span class="progress-stage">正在初始化...</span>
                    <span class="progress-count">0/0 张图片</span>
                </div>
            </div>
        `;
        
        try {
            // 阶段1: 获取图片列表 (0-10%)
            this.updateLoadingProgress(0, '正在获取图片列表...', 0, 0);
            const imageList = await this.loadImagesFromAutoScan();
            const totalImages = imageList.length;
            this.updateLoadingProgress(10, '图片列表获取完成', totalImages, totalImages);
            
            if (totalImages === 0) {
                this.imageGrid.innerHTML = '<p class="loading-text">未找到图片，请检查COS配置</p>';
                return;
            }
            
            // 阶段2: 生成签名URL (10-50%) - 使用分批批量处理
            this.updateLoadingProgress(10, '正在生成访问密钥...', 0, totalImages);
            
            // 批次大小配置（每批处理50张图片）
            const BATCH_SIZE = 50;
            const processedConfigs = [];
            
            // 如果启用了COS签名访问，使用批量API
            if (window.CDN_CONFIG.cos && window.CDN_CONFIG.cos.useSignature) {
                // 分批处理图片列表
                const batches = [];
                for (let i = 0; i < imageList.length; i += BATCH_SIZE) {
                    batches.push(imageList.slice(i, i + BATCH_SIZE));
                }
                
                const totalBatches = batches.length;
                
                // 逐批处理
                for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
                    const batch = batches[batchIndex];
                    const batchStartIndex = batchIndex * BATCH_SIZE;
                    
                    try {
                        // 更新进度：显示当前批次
                        const batchProgress = 10 + (batchIndex / totalBatches) * 40;
                        this.updateLoadingProgress(
                            batchProgress,
                            `正在生成访问密钥... (第 ${batchIndex + 1}/${totalBatches} 批)`,
                            batchStartIndex,
                            totalImages
                        );
                        
                        // 收集当前批次的所有URL
                        const batchUrls = batch.map(img => {
                            if (!img.url || img.url.trim() === '') {
                                throw new Error('图片URL未配置');
                            }
                            return img.url;
                        });
                        
                        // 批量获取签名URL
                        let signedUrls = [];
                        if (window.CDN_CONFIG.cos.useBackendApi && window.cosApiUtils) {
                            // 使用后端批量API（推荐，密钥不暴露）
                            try {
                                signedUrls = await window.cosApiUtils.getSignedUrls(batchUrls);
                                window.logger?.log(`批次 ${batchIndex + 1} 签名URL批量生成成功，共 ${signedUrls.length} 个`);
                            } catch (error) {
                                window.logger?.error(`批次 ${batchIndex + 1} 批量生成签名URL失败:`, error);
                                // 如果批量失败，回退到逐个生成
                                signedUrls = await this.fallbackToIndividualSigning(batch, batchIndex, totalBatches, totalImages);
                            }
                        } else if (window.cosUtils) {
                            // 使用前端SDK批量生成（密钥会暴露，不推荐）
                            try {
                                signedUrls = await window.cosUtils.getSignedUrls(batchUrls);
                                window.logger?.log(`批次 ${batchIndex + 1} 签名URL批量生成成功，共 ${signedUrls.length} 个`);
                            } catch (error) {
                                window.logger?.error(`批次 ${batchIndex + 1} 批量生成签名URL失败:`, error);
                                // 如果批量失败，回退到逐个生成
                                signedUrls = await this.fallbackToIndividualSigning(batch, batchIndex, totalBatches, totalImages);
                            }
                        } else {
                            // 没有可用的签名服务，使用原始URL
                            signedUrls = batchUrls;
                        }
                        
                        // 将签名URL与图片配置匹配
                        for (let i = 0; i < batch.length; i++) {
                            const imageConfig = batch[i];
                            const signedUrl = signedUrls[i] || imageConfig.url;
                            
                            processedConfigs.push({
                                ...imageConfig,
                                signedUrl: signedUrl
                            });
                        }
                        
                        // 更新进度：批次完成
                        const batchCompleteProgress = 10 + ((batchIndex + 1) / totalBatches) * 40;
                        this.updateLoadingProgress(
                            batchCompleteProgress,
                            `正在生成访问密钥... (第 ${batchIndex + 1}/${totalBatches} 批完成)`,
                            Math.min(batchStartIndex + batch.length, totalImages),
                            totalImages
                        );
                    } catch (error) {
                        window.logger?.error(`处理批次 ${batchIndex + 1} 时出错:`, error);
                        // 批次失败，使用原始URL继续
                        for (const imageConfig of batch) {
                            processedConfigs.push({
                                ...imageConfig,
                                signedUrl: imageConfig.url || '',
                                error: error.message
                            });
                        }
                        // 更新进度
                        const batchCompleteProgress = 10 + ((batchIndex + 1) / totalBatches) * 40;
                        this.updateLoadingProgress(
                            batchCompleteProgress,
                            `正在生成访问密钥... (第 ${batchIndex + 1}/${totalBatches} 批完成)`,
                            Math.min(batchStartIndex + batch.length, totalImages),
                            totalImages
                        );
                    }
                }
            } else {
                // 未启用签名访问，直接使用原始URL
                for (const imageConfig of imageList) {
                    processedConfigs.push({
                        ...imageConfig,
                        signedUrl: imageConfig.url || ''
                    });
                }
                this.updateLoadingProgress(50, '跳过签名URL生成', totalImages, totalImages);
            }
            
            // 阶段3: 加载图片 (50-100%)
            this.updateLoadingProgress(50, '正在加载图片...', 0, totalImages);
            
            const loadPromises = processedConfigs.map(async (config, index) => {
                try {
                    const imageData = config.signedUrl || config.url;
                    
                    // 更新进度：50% + (index+1)/total * 50%
                    const loadProgress = 50 + ((index + 1) / totalImages) * 50;
                    this.updateLoadingProgress(
                        loadProgress,
                        '正在加载图片...',
                        index + 1,
                        totalImages
                    );
                    
                    return {
                        name: config.filename,
                        displayName: config.name || config.filename,
                        url: config.signedUrl || config.url,
                        data: imageData,
                        config: config,
                        loaded: true
                    };
                } catch (error) {
                    window.logger?.error(`加载图片失败: ${config.filename}`, error);
                    return {
                        name: config.filename,
                        displayName: config.name || config.filename,
                        url: config.url || '',
                        data: null,
                        config: config,
                        loaded: false,
                        error: error.message || config.error
                    };
                }
            });

            this.availableImages = await Promise.all(loadPromises);
            
            // 加载完成
            this.updateLoadingProgress(100, '加载完成', totalImages, totalImages);
            
            // 短暂延迟后渲染图片网格，让用户看到100%完成
            await new Promise(resolve => setTimeout(resolve, 300));
            this.renderImageGrid();
        } catch (error) {
            window.logger?.error('加载图片配置时出错：', error);
            this.imageGrid.innerHTML = '<p class="loading-text">图片配置加载失败，请检查COS配置和网络连接</p>';
        }
    }

    /**
     * 自动扫描COS目录获取图片列表
     */
    async loadImagesFromAutoScan() {
        const autoScan = window.CDN_CONFIG.autoScan;
        const config = window.CDN_CONFIG;
        
        // 更新进度：正在获取图片列表
        this.updateLoadingProgress(5, '正在连接服务器获取图片列表...', 0, 0);
        
        let cosImages = [];
        
        // 根据配置选择使用后端API或前端SDK
        if (config.cos?.useBackendApi && window.cosApiUtils) {
            // 使用后端API（推荐，密钥不暴露）
            window.logger?.log('开始自动扫描COS目录（使用后端API）:', autoScan.prefix);
            this.updateLoadingProgress(7, '正在从服务器获取图片列表...', 0, 0);
            cosImages = await window.cosApiUtils.listImages(autoScan.prefix);
        } else if (window.cosUtils && window.cosUtils.cos) {
            // 使用前端SDK（密钥会暴露，不推荐）
            window.logger?.log('开始自动扫描COS目录（使用前端SDK）:', autoScan.prefix);
            this.updateLoadingProgress(7, '正在从服务器获取图片列表...', 0, 0);
            cosImages = await window.cosUtils.listImages(autoScan.prefix);
        } else {
            throw new Error('COS服务未初始化，无法自动扫描');
        }
        
        // 2. 加载名称映射文件（如果配置了）
        let nameMapping = {};
        if (autoScan.nameMappingPath) {
            try {
                let mappingUrl = window.CDN_CONFIG.baseUrl + autoScan.nameMappingPath;
                
                // 如果启用了COS签名访问，生成签名URL
                if (window.CDN_CONFIG.cos && window.CDN_CONFIG.cos.useSignature) {
                    try {
                        // 根据配置选择使用后端API或前端SDK
                        if (window.CDN_CONFIG.cos.useBackendApi && window.cosApiUtils) {
                            mappingUrl = await window.cosApiUtils.getSignedUrl(mappingUrl);
                        } else if (window.cosUtils) {
                            mappingUrl = await window.cosUtils.getSignedUrl(mappingUrl);
                        }
                    } catch (error) {
                        window.logger?.warn('生成名称映射文件签名URL失败:', error);
                    }
                }
                
                const mappingResponse = await fetch(mappingUrl);
                if (mappingResponse.ok) {
                    const mappingData = await mappingResponse.json();
                    nameMapping = mappingData.mappings || {};
                    window.logger?.log('名称映射文件加载成功，共', Object.keys(nameMapping).length, '条映射');
                } else {
                    window.logger?.warn('名称映射文件不存在或无法访问，将使用文件名作为显示名称');
                }
            } catch (error) {
                window.logger?.warn('加载名称映射文件失败，将使用文件名作为显示名称:', error);
            }
        }
        
        // 3. 构建图片列表
        const imageList = cosImages.map(image => {
            // 使用映射文件中的显示名称，如果没有则使用文件名
            const displayName = nameMapping[image.filename] || image.filename;
            
            return {
                name: displayName,
                filename: image.filename,
                url: image.url
            };
        });
        
        window.logger?.log(`自动扫描完成，共找到 ${imageList.length} 张图片`);
        return imageList;
    }



    getDisplayName(filename) {
        // 优先使用配置文件中的displayName
        const image = this.availableImages.find(img => img.name === filename);
        if (image && image.displayName) {
            return image.displayName;
        }
        
        // 回退到原来的逻辑
        const lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex > 0) {
            return filename.substring(0, lastDotIndex);
        }
        return filename;
    }

    normalizeSearchKeyword(value) {
        return (value || '').toString().trim().toLowerCase().replace(/\s+/g, '');
    }

    getPinyinInitials(text) {
        const source = (text || '').toString();
        const letterMap = 'ABCDEFGHJKLMNOPQRSTWXYZ';
        const boundaryMap = '阿八嚓哒妸发旮哈讥咔垃妈拿哦啪期然撒塌穵昔压匝';
        let initials = '';

        for (const char of source) {
            if (/^[a-z0-9]$/i.test(char)) {
                initials += char.toLowerCase();
                continue;
            }

            if (/^[\u4e00-\u9fff]$/.test(char)) {
                let letter = '';
                for (let i = boundaryMap.length - 1; i >= 0; i--) {
                    if (char.localeCompare(boundaryMap[i], 'zh-CN') >= 0) {
                        letter = letterMap[i];
                        break;
                    }
                }
                if (letter) {
                    initials += letter.toLowerCase();
                }
            }
        }

        return initials;
    }

    getFilteredImages() {
        const keyword = this.normalizeSearchKeyword(this.searchKeyword);

        const derivedList = this.availableImages.map((image, originalIndex) => {
            const displayName = this.getDisplayName(image.name);
            const normalizedName = this.normalizeSearchKeyword(displayName);
            const pinyinInitials = this.getPinyinInitials(displayName);

            return {
                image,
                originalIndex,
                displayName,
                normalizedName,
                pinyinInitials
            };
        });

        return !keyword
            ? derivedList
            : derivedList.filter(item => (
                item.normalizedName.includes(keyword) ||
                item.pinyinInitials.includes(keyword)
            ));
    }


    renderImageGrid() {
        this.imageGrid.innerHTML = '';
        const displayImages = this.getFilteredImages();

        if (displayImages.length === 0) {
            this.imageGrid.innerHTML = '<p class="loading-text">未找到匹配名片</p>';
            return;
        }

        displayImages.forEach(({ image, originalIndex, displayName }) => {
            const imageItem = document.createElement('div');
            imageItem.className = 'image-item';
            imageItem.dataset.index = originalIndex;
            const isSelected = this.selectedImages.some(item => item.index === originalIndex);
            if (isSelected) {
                imageItem.classList.add('selected');
            }
            
            if (image.loaded) {
                imageItem.innerHTML = `
                    <div class="checkbox">✓</div>
                    <img src="${image.data}" alt="${displayName}">
                    <div class="image-name">${displayName}</div>
                `;
                
                imageItem.addEventListener('click', () => this.toggleImageSelection(originalIndex));
            } else {
                imageItem.innerHTML = `
                    <div class="image-name" style="padding: 40px; color: #ef4444;">
                        ${displayName}<br>
                        <small>加载失败</small>
                    </div>
                `;
                imageItem.style.opacity = '0.5';
            }
            
            this.imageGrid.appendChild(imageItem);
        });
    }

    toggleImageSelection(index) {
        const image = this.availableImages[index];
        if (!image.loaded) return;

        const existingSelection = this.selectedImages.find(item => item.index === index);
        
        if (existingSelection) {
            // 取消选择
            this.selectedImages = this.selectedImages.filter(item => item.index !== index);
        } else {
            // 选择
            this.selectedImages.push({ index, quantity: 1 });
        }

        this.renderImageGrid();
        this.updateStep1Buttons();
    }

    updateStep1Buttons() {
        this.nextToStep2.disabled = this.selectedImages.length === 0;
    }

    goToStep(step) {
        // 隐藏当前页面
        this.pages.forEach(page => page.classList.remove('active'));
        
        // 显示目标页面
        document.getElementById(`page${step}`).classList.add('active');
        
        // 更新进度指示器
        this.progressSteps.forEach((stepEl, index) => {
            stepEl.classList.remove('active', 'completed');
            if (index + 1 < step) {
                stepEl.classList.add('completed');
            } else if (index + 1 === step) {
                stepEl.classList.add('active');
            }
        });
        
        this.currentStep = step;
        
        // 执行页面特定的更新
        switch (step) {
            case 2:
                this.updateStep2();
                break;
            case 3:
                this.updateStep3();
                break;
            case 4:
                this.updateStep4();
                break;
        }
    }

    updateStep2() {
        this.renderSelectedImagesList();
        this.updateTotalQuantity();
    }

    renderSelectedImagesList() {
        this.selectedImagesList.innerHTML = '';
        
        this.selectedImages.forEach((selection, listIndex) => {
            const image = this.availableImages[selection.index];
            const item = document.createElement('div');
            item.className = 'image-quantity-item';
            item.innerHTML = `
                <img src="${image.data}" alt="${this.getDisplayName(image.name)}">
                <div class="image-quantity-info">
                    <div class="image-name">${this.getDisplayName(image.name)}</div>
                    <div class="image-size">${image.data ? '已加载' : '加载失败'}</div>
                </div>
                <div class="quantity-controls">
                    <button type="button" class="quantity-btn decrease-btn" data-index="${listIndex}">-</button>
                    <input type="number" class="quantity-input" value="${selection.quantity}" min="1" max="100" data-index="${listIndex}">
                    <button type="button" class="quantity-btn increase-btn" data-index="${listIndex}">+</button>
                </div>
            `;
            
            // 绑定事件
            const decreaseBtn = item.querySelector('.decrease-btn');
            const increaseBtn = item.querySelector('.increase-btn');
            const quantityInput = item.querySelector('.quantity-input');
            
            decreaseBtn.addEventListener('click', () => this.changeQuantity(listIndex, -1));
            increaseBtn.addEventListener('click', () => this.changeQuantity(listIndex, 1));
            quantityInput.addEventListener('input', (e) => this.updateQuantity(listIndex, parseInt(e.target.value)));
            
            this.selectedImagesList.appendChild(item);
        });
    }

    changeQuantity(listIndex, delta) {
        const newQuantity = Math.max(1, this.selectedImages[listIndex].quantity + delta);
        this.selectedImages[listIndex].quantity = newQuantity;
        this.updateQuantityInput(listIndex, newQuantity);
        this.updateTotalQuantity();
    }

    updateQuantity(listIndex, quantity) {
        this.selectedImages[listIndex].quantity = Math.max(1, Math.min(100, quantity || 1));
        this.updateQuantityInput(listIndex, this.selectedImages[listIndex].quantity);
        this.updateTotalQuantity();
    }

    updateQuantityInput(listIndex, quantity) {
        const input = this.selectedImagesList.children[listIndex].querySelector('.quantity-input');
        if (input) {
            input.value = quantity;
        }
    }

    updateTotalQuantity() {
        const total = this.selectedImages.reduce((sum, selection) => sum + selection.quantity, 0);
        this.totalQuantity.textContent = total;
    }

    updateStep3() {
        // 如果是单独设定模式，需要重新渲染设定界面以反映数量变化
        if (this.settingMode === 'individual') {
            this.renderIndividualSettings();
        }
        this.updatePreviewImages();
        this.updateStep3Buttons();
    }

    formatBakingDate(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `烘焙日期：${year}年${month}月${day}日`;
    }

    formatWeight(weightValue) {
        if (!weightValue || weightValue === '') return '';
        return `${weightValue}g`;
    }

    getTextContentForImage(imageIndex, copyIndex = 0) {
        let bakingDate = '';
        let weight = '';
        
        if (this.settingMode === 'global') {
            bakingDate = this.formatBakingDate(this.globalBakingDate);
            weight = this.formatWeight(this.globalWeight);
        } else {
            const setting = this.individualSettingsData[imageIndex] || {};
            if (setting.copies && setting.copies[copyIndex]) {
                // 使用副本级别的设定
                const copy = setting.copies[copyIndex];
                bakingDate = this.formatBakingDate(copy.bakingDate);
                weight = this.formatWeight(copy.weight);
            } else {
                // 回退到图片级别的设定
                bakingDate = this.formatBakingDate(setting.bakingDate);
                weight = this.formatWeight(setting.weight);
            }
        }
        
        return {
            bakingDate,
            weight
        };
    }

    updatePreviewImages() {
        if (this.selectedImages.length === 0) {
            this.previewImagesGrid.innerHTML = '<p class="no-preview">请先选择图片</p>';
            this.previewImageInfo.textContent = '请先选择图片';
            this.previewQuantityInfo.textContent = '';
            return;
        }

        this.previewImagesGrid.innerHTML = '';
        
        this.selectedImages.forEach((selection, listIndex) => {
            const image = this.availableImages[selection.index];
            
            // 为每个副本创建预览
            for (let copyIndex = 0; copyIndex < selection.quantity; copyIndex++) {
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';
                previewItem.dataset.index = listIndex;
                previewItem.dataset.copy = copyIndex;
                
                // 创建预览图片
                const img = new Image();
                img.crossOrigin = 'anonymous'; // 添加跨域支持
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // 1:1预览，保持原始尺寸比例
                    canvas.width = img.width;
                    canvas.height = img.height;
                    
                    // 绘制图片（1:1）
                    ctx.drawImage(img, 0, 0);
                    
                    // 绘制文字（1:1，不需要缩放）
                    const textContent = this.getTextContentForImage(selection.index, copyIndex);
                    this.drawTextsOnOriginalCanvas(ctx, img.width, img.height, textContent);
                    
                    // 获取副本的设定信息
                    let copyInfo = '';
                    if (this.settingMode === 'individual') {
                        const setting = this.individualSettingsData[selection.index];
                        if (setting && setting.copies && setting.copies[copyIndex]) {
                            const copy = setting.copies[copyIndex];
                            copyInfo = `
                                <div class="preview-copy-info">
                                    <div class="preview-copy-baking">${this.formatBakingDate(copy.bakingDate) || '无'}</div>
                                    <div class="preview-copy-weight">${this.formatWeight(copy.weight) || '无'}</div>
                                </div>
                            `;
                        }
                    } else {
                        copyInfo = `
                            <div class="preview-copy-info">
                                <div class="preview-copy-baking">${this.formatBakingDate(this.globalBakingDate) || '无'}</div>
                                <div class="preview-copy-weight">${this.formatWeight(this.globalWeight) || '无'}</div>
                            </div>
                        `;
                    }
                    
                    previewItem.innerHTML = `
                        <img src="${canvas.toDataURL('image/png', 1.0)}" alt="${this.getDisplayName(image.name)}" style="max-width: 100%; height: auto;">
                        <div class="preview-item-info">
                            <div class="preview-item-name">${this.getDisplayName(image.name)}</div>
                            <div class="preview-item-copy">第 ${copyIndex + 1} 张</div>
                            ${copyInfo}
                        </div>
                    `;
                    
                    // 添加点击放大功能
                    previewItem.addEventListener('click', () => this.showImageModal(canvas.toDataURL('image/png', 1.0), `${this.getDisplayName(image.name)} - 第${copyIndex + 1}张`));
                };
                img.onerror = () => {
                    window.logger?.error('预览图片加载失败:', image.url);
                    previewItem.innerHTML = `
                        <div style="padding: 40px; color: #ef4444; text-align: center;">
                            <div>${this.getDisplayName(image.name)}</div>
                            <div style="font-size: 12px; margin-top: 5px;">图片加载失败</div>
                        </div>
                    `;
                };
                img.src = image.data;
                
                this.previewImagesGrid.appendChild(previewItem);
            }
        });
        
        // 更新预览信息
        const totalQuantity = this.selectedImages.reduce((sum, selection) => sum + selection.quantity, 0);
        this.previewImageInfo.textContent = `已选择 ${this.selectedImages.length} 张图片`;
        this.previewQuantityInfo.textContent = `总计 ${totalQuantity} 张`;
    }


    drawTextWithSpacing(ctx, text, x, y, letterSpacing) {
        if (letterSpacing === 0) {
            ctx.fillText(text, x, y);
        } else {
            let currentX = x;
            for (let i = 0; i < text.length; i++) {
                ctx.fillText(text[i], currentX, y);
                currentX += ctx.measureText(text[i]).width + letterSpacing;
            }
        }
    }

    showImageModal(imageData, imageName) {
        this.modalImage.src = imageData;
        this.modalImageName.textContent = imageName;
        this.imageModal.style.display = 'flex';
    }

    closeImageModal() {
        this.imageModal.style.display = 'none';
    }

    updateStep3Buttons() {
        let hasContent = false;
        
        if (this.settingMode === 'global') {
            hasContent = this.globalBakingDate || this.globalWeight;
        } else {
            // 检查是否至少有一张图片有内容
            hasContent = this.selectedImages.some(selection => {
                const setting = this.individualSettingsData[selection.index];
                if (!setting) return false;
                
                // 检查图片级别的设定
                if (setting.bakingDate || setting.weight) return true;
                
                // 检查副本级别的设定
                if (setting.copies) {
                    return setting.copies.some(copy => copy.bakingDate || copy.weight);
                }
                
                return false;
            });
        }
        
        this.nextToStep4.disabled = !hasContent || this.selectedImages.length === 0;
    }

    updateStep4() {
        const totalQuantity = this.selectedImages.reduce((sum, selection) => sum + selection.quantity, 0);
        this.pdfImageCount.textContent = this.selectedImages.length;
        this.pdfTotalQuantity.textContent = totalQuantity;
        
        // 生成咖啡详情
        this.updateCoffeeDetails();
        
        this.downloadPdf.disabled = !this.generatedPdf;
    }
    
    updateCoffeeDetails() {
        const tableBody = document.getElementById('coffeeTableBody');
        if (!tableBody) return;
        
        let tableRows = '';
        
        this.selectedImages.forEach((selection, index) => {
            const image = this.availableImages[selection.index];
            const imageName = this.getDisplayName(image.name);
            
            if (this.settingMode === 'global') {
                // 全局设定模式
                const bakingDate = this.formatBakingDate(this.globalBakingDate) || '无';
                const weight = this.formatWeight(this.globalWeight) || '无';
                // 移除"烘焙日期："前缀，只保留日期部分
                const dateOnly = bakingDate.replace('烘焙日期：', '');
                tableRows += `
                    <tr>
                        <td class="coffee-name" title="${imageName}">${imageName}</td>
                        <td class="weight">${weight}</td>
                        <td class="baking-date">${dateOnly}</td>
                        <td class="quantity">${selection.quantity}张</td>
                    </tr>
                `;
            } else {
                // 单独设定模式
                const individualSetting = this.individualSettingsData[selection.index];
                if (individualSetting && individualSetting.copies) {
                    individualSetting.copies.forEach((copy, copyIndex) => {
                        const bakingDate = this.formatBakingDate(copy.bakingDate) || '无';
                        const weight = this.formatWeight(copy.weight) || '无';
                        // 移除"烘焙日期："前缀，只保留日期部分
                        const dateOnly = bakingDate.replace('烘焙日期：', '');
                        tableRows += `
                            <tr>
                                <td class="coffee-name" title="${imageName}">${imageName}</td>
                                <td class="weight">${weight}</td>
                                <td class="baking-date">${dateOnly}</td>
                                <td class="quantity">1张</td>
                            </tr>
                        `;
                    });
                } else {
                    tableRows += `
                        <tr>
                            <td class="coffee-name" title="${imageName}">${imageName}</td>
                            <td class="weight">无设定</td>
                            <td class="baking-date">无设定</td>
                            <td class="quantity">${selection.quantity}张</td>
                        </tr>
                    `;
                }
            }
        });
        
        if (tableRows) {
            tableBody.innerHTML = tableRows;
        } else {
            tableBody.innerHTML = '<tr><td colspan="4" class="no-data">暂无详情</td></tr>';
        }
    }

    async generatePDF() {
        if (this.selectedImages.length === 0) {
            alert('请先选择图片！');
            return;
        }
        
        let hasContent = false;
        if (this.settingMode === 'global') {
            hasContent = this.globalBakingDate || this.globalWeight;
        } else {
            hasContent = this.selectedImages.some(selection => {
                const setting = this.individualSettingsData[selection.index];
                if (!setting) return false;
                
                // 检查图片级别的设定
                if (setting.bakingDate || setting.weight) return true;
                
                // 检查副本级别的设定
                if (setting.copies) {
                    return setting.copies.some(copy => copy.bakingDate || copy.weight);
                }
                
                return false;
            });
        }
        
        if (!hasContent) {
            alert('请至少填写一个字段！');
            return;
        }

        this.generatePdf.disabled = true;
        this.generatePdf.textContent = '生成中...';

        try {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('portrait', 'mm', 'a4');
            
            // 去掉边距，使用全页面
            const pageWidth = 210; // A4宽度
            const pageHeight = 297; // A4高度
            const cardWidth = pageWidth / 2; // 2列
            const cardHeight = pageHeight / 4; // 4行
            
            // 计算总卡片数
            const totalCards = this.selectedImages.reduce((sum, selection) => sum + selection.quantity, 0);
            let processedCards = 0;
            let cardsOnPage = 0;
            
            // 为每张选中的图片生成指定数量的副本
            for (let listIndex = 0; listIndex < this.selectedImages.length; listIndex++) {
                const selection = this.selectedImages[listIndex];
                const imageData = this.availableImages[selection.index];
                
                for (let copyIndex = 0; copyIndex < selection.quantity; copyIndex++) {
                    // 检查是否需要新页面
                    if (cardsOnPage >= 8) {
                        pdf.addPage();
                        cardsOnPage = 0;
                    }
                    
                    // 等待图片加载完成
                    await this.processImageForPDF(pdf, imageData.url, selection.index, copyIndex, cardsOnPage, cardWidth, cardHeight);
                    
                    cardsOnPage++;
                    processedCards++;
                    
                    // 更新进度
                    this.generatePdf.textContent = `生成中... ${processedCards}/${totalCards}`;
                    
                    // 添加1秒延迟
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
            
            // 添加裁剪线
            this.addCuttingLines(pdf, pageWidth, pageHeight, cardWidth, cardHeight);
            
            this.generatedPdf = pdf;
            this.generatePdf.disabled = false;
            this.generatePdf.textContent = '重新生成PDF';
            this.downloadPdf.disabled = false;
            
            alert(`PDF生成完成！共 ${totalCards} 张名片，${Math.ceil(totalCards / 8)} 页`);
            
        } catch (error) {
            window.logger?.error('生成PDF时出错：', error);
            alert('生成PDF时出错，请重试！');
            this.generatePdf.disabled = false;
            this.generatePdf.textContent = '生成PDF';
        }
    }

    processImageForPDF(pdf, imageData, imageIndex, copyIndex, cardPosition, cardWidth, cardHeight) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous'; // 添加跨域支持
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    canvas.width = img.width;
                    canvas.height = img.height;
                    
                    ctx.drawImage(img, 0, 0);
                    const textContent = this.getTextContentForImage(imageIndex, copyIndex);
                    this.drawTextsOnOriginalCanvas(ctx, img.width, img.height, textContent);
                    
                    const row = Math.floor(cardPosition / 2);
                    const col = cardPosition % 2;
                    const x = col * cardWidth;
                    const y = row * cardHeight;
                    
                    pdf.addImage(
                        canvas.toDataURL('image/png', 1.0), 
                        'PNG', 
                        x, 
                        y, 
                        cardWidth, 
                        cardHeight
                    );
                    
                    resolve();
                } catch (error) {
                    reject(error);
                }
            };
            img.onerror = () => {
                reject(new Error('图片加载失败'));
            };
            img.src = imageData;
        });
    }

    drawTextsOnOriginalCanvas(ctx, canvasWidth, canvasHeight, textContent) {
        // 绘制烘焙日期
        if (textContent.bakingDate) {
            const bakingDateFontSize = 21;
            const fontFamily = "'OPPO Sans 4.0'";
            const bakingDateColor = "#7f463a";
            const letterSpacing = 0;
            
            const bakingDateX = 35.6;
            const bakingDateY = 793.91;
            
            ctx.font = `${bakingDateFontSize}px ${fontFamily}`;
            ctx.fillStyle = bakingDateColor;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            
            this.drawTextWithSpacing(ctx, textContent.bakingDate, bakingDateX, bakingDateY, letterSpacing);
        }
        
        // 绘制重量
        if (textContent.weight) {
            const weightFontSize = 31.25;
            const fontFamily = "'OPPO Sans 4.0'";
            const weightColor = "#000000";
            const letterSpacing = 0;
            
            const weightX = 527;
            const weightY = 485;
            
            ctx.font = `${weightFontSize}px ${fontFamily}`;
            ctx.fillStyle = weightColor;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            
            this.drawTextWithSpacing(ctx, textContent.weight, weightX, weightY, letterSpacing);
        }
    }

    addCuttingLines(pdf, pageWidth, pageHeight, cardWidth, cardHeight) {
        // 设置线条样式
        pdf.setDrawColor(255, 255, 255); // 黑色
        pdf.setLineWidth(0.25); // 2px线宽
        
        // 获取PDF总页数
        const totalPages = pdf.internal.getNumberOfPages();
        
        // 为每一页添加裁剪线
        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
            pdf.setPage(pageNum);
            
            // 绘制垂直分割线（2列）
            for (let col = 1; col < 2; col++) {
                const x = col * cardWidth;
                pdf.line(x, 0, x, pageHeight);
            }
            
            // 绘制水平分割线（4行）
            for (let row = 1; row < 4; row++) {
                const y = row * cardHeight;
                pdf.line(0, y, pageWidth, y);
            }
        }
    }


    async downloadPDF() {
        if (this.generatedPdf) {
            // 生成带序号的文件名
            const filename = await this.generateFilenameWithSequence('pdf');
            
            // 检测是否为iOS Safari
            const isIOSSafari = /iPad|iPhone|iPod/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent);
            
            if (isIOSSafari) {
                // iOS Safari特殊处理：先保存log，再下载PDF
                this.saveLogToServer(filename).then(() => {
                    // log保存完成后再下载PDF
                    setTimeout(() => {
                        this.generatedPdf.save(filename);
                        this.clearCache();
                    }, 500);
                });
            } else {
                // 其他浏览器：先下载PDF，再保存log
                this.generatedPdf.save(filename);
                
                // 延迟执行log文件保存，避免混淆
                setTimeout(() => {
                    this.saveLogToServer(filename);
                }, 1000);
                
                // 自动清理缓存（静默进行）
                this.clearCache();
            }
        }
    }

    async saveLogToServer(pdfFilename) {
        try {
            // 生成详细的log内容
            const logData = this.generateLogData(pdfFilename);
            
            // 创建log文件内容
            const logContent = this.formatLogContent(logData);
            
            // 生成与PDF文件名一致的log文件名
            const logFilename = await this.generateLogFilename(pdfFilename);
            
            // 发送到服务器保存
            const response = await fetch('/api/save-log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    filename: logFilename,
                    content: logContent,
                    logData: logData
                })
            });
            
            if (response.ok) {
                window.logger?.log('Log文件已保存到服务器:', logFilename);
            } else {
                window.logger?.error('保存log文件到服务器失败:', response.statusText);
                // log文件只需要保存到服务器，不需要下载到本地
            }
            
        } catch (error) {
            window.logger?.error('保存log文件时出错:', error);
            // log文件只需要保存到服务器，不需要下载到本地
        }
    }

    async generateFilenameWithSequence(extension) {
        try {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            
            // 获取当天已有的文件数量来确定序号
            const response = await fetch('/api/logs');
            const data = await response.json();
            
            if (data.success) {
                const todayPrefix = `${year}-${month}-${day}`;
                const todayFiles = data.logs.filter(log => log.filename.startsWith(todayPrefix));
                const sequence = String(todayFiles.length + 1).padStart(2, '0');
                return `${todayPrefix}-${sequence}.${extension}`;
            } else {
                // 如果获取文件列表失败，使用序号01
                return `${year}-${month}-${day}-01.${extension}`;
            }
        } catch (error) {
            window.logger?.error('生成文件名时出错:', error);
            // 出错时返回默认文件名
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}-01.${extension}`;
        }
    }

    async generateLogFilename(pdfFilename) {
        try {
            // 使用PDF文件名作为基础，将.pdf替换为.log
            const logFilename = pdfFilename.replace('.pdf', '.log');
            return logFilename;
            
        } catch (error) {
            window.logger?.error('生成log文件名时出错:', error);
            // 出错时返回默认文件名
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}-01.log`;
        }
    }

    downloadLogFile(logContent, logFilename) {
        try {
            // 创建Blob对象
            const blob = new Blob([logContent], { type: 'text/plain;charset=utf-8' });
            
            // 创建下载链接
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = logFilename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            window.logger?.log('Log文件已下载到本地:', logFilename);
            
        } catch (error) {
            window.logger?.error('下载log文件时出错:', error);
        }
    }

    generateLogData(pdfFilename) {
        const now = new Date();
        const timestamp = now.toISOString();
        const localTime = now.toLocaleString('zh-CN', {
            timeZone: 'Asia/Shanghai',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        // 计算总数量
        const totalQuantity = this.selectedImages.reduce((sum, selection) => sum + selection.quantity, 0);
        const totalPages = Math.ceil(totalQuantity / 8);

        // 生成图片详情
        const imageDetails = this.selectedImages.map((selection, index) => {
            const image = this.availableImages[selection.index];
            const textContent = this.getTextContentForImage(selection.index);
            
            return {
                index: index + 1,
                imageName: this.getDisplayName(image.name),
                quantity: selection.quantity,
                bakingDate: textContent.bakingDate || '无',
                weight: textContent.weight || '无'
            };
        });

        return {
            timestamp,
            localTime,
            pdfFilename,
            settingMode: this.settingMode,
            totalImages: this.selectedImages.length,
            totalQuantity,
            totalPages,
            imageDetails,
            globalSettings: this.settingMode === 'global' ? {
                bakingDate: this.formatBakingDate(this.globalBakingDate) || '无',
                weight: this.formatWeight(this.globalWeight) || '无'
            } : null,
            individualSettings: this.settingMode === 'individual' ? this.individualSettingsData : null
        };
    }

    formatLogContent(logData) {
        let content = '';
        
        content += '='.repeat(80) + '\n';
        content += '咖啡名片批量编辑器 - 生成日志\n';
        content += '='.repeat(80) + '\n\n';
        
        content += `生成时间: ${logData.localTime}\n`;
        content += `UTC时间: ${logData.timestamp}\n`;
        content += `PDF文件名: ${logData.pdfFilename}\n\n`;
        
        content += '-'.repeat(50) + '\n';
        content += '生成设置\n';
        content += '-'.repeat(50) + '\n';
        content += `设定模式: ${logData.settingMode === 'global' ? '全局设定' : '单独设定'}\n`;
        content += `选中图片数量: ${logData.totalImages} 张\n`;
        content += `总制作数量: ${logData.totalQuantity} 张\n`;
        content += `PDF总页数: ${logData.totalPages} 页\n\n`;
        
        if (logData.settingMode === 'global' && logData.globalSettings) {
            content += '-'.repeat(50) + '\n';
            content += '全局设定\n';
            content += '-'.repeat(50) + '\n';
            content += `烘焙日期: ${logData.globalSettings.bakingDate}\n`;
            content += `重量: ${logData.globalSettings.weight}\n\n`;
        }
        
        content += '-'.repeat(50) + '\n';
        content += '图片详情\n';
        content += '-'.repeat(50) + '\n';
        
        logData.imageDetails.forEach((detail, index) => {
            content += `图片 ${detail.index}:\n`;
            content += `  文件名: ${detail.imageName}\n`;
            content += `  制作数量: ${detail.quantity} 张\n`;
            content += `  烘焙日期: ${detail.bakingDate}\n`;
            content += `  重量: ${detail.weight}\n`;
            if (index < logData.imageDetails.length - 1) {
                content += '\n';
            }
        });
        
        
        content += '\n' + '='.repeat(80) + '\n';
        content += '日志结束\n';
        content += '='.repeat(80) + '\n';
        
        return content;
    }

    clearCache() {
        try {
            // 清理内存中的图片数据
            this.availableImages.forEach(image => {
                if (image.data && typeof image.data === 'string' && image.data.startsWith('data:')) {
                    // 清理base64数据
                    image.data = null;
                }
            });
            
            // 清理预览图片的canvas缓存
            const previewItems = this.previewImagesGrid.querySelectorAll('.preview-item');
            previewItems.forEach(item => {
                const img = item.querySelector('img');
                if (img && img.src.startsWith('data:')) {
                    img.src = '';
                }
            });
            
            // 清理PDF对象
            if (this.generatedPdf) {
                this.generatedPdf = null;
            }
            
            // 强制垃圾回收（如果浏览器支持）
            if (window.gc) {
                window.gc();
            }
            
            window.logger?.log('缓存清理完成');
        } catch (error) {
            window.logger?.warn('缓存清理时出现错误:', error);
        }
    }

    restart() {
        // 重置所有数据
        this.selectedImages = [];
        this.settingMode = 'global';
        this.globalBakingDate = '';
        this.globalWeight = '';
        this.individualSettingsData = {}; // 重置数据对象
        this.generatedPdf = null;
        
        // 重置界面
        document.querySelector('input[name="settingMode"][value="global"]').checked = true;
        this.globalSettings.style.display = 'block';
        this.individualSettings.style.display = 'none'; // 使用DOM元素
        this.globalBakingDateInput.value = new Date().toISOString().split('T')[0];
        this.globalWeightInput.value = '';
        
        // 清除图片选择状态
        const imageItems = this.imageGrid.querySelectorAll('.image-item');
        imageItems.forEach(item => {
            item.classList.remove('selected');
        });
        
        // 重置预览区域
        this.previewImagesGrid.innerHTML = '<p class="no-preview">请先选择图片</p>';
        this.previewImageInfo.textContent = '请先选择图片';
        this.previewQuantityInfo.textContent = '';
        
        // 重置PDF相关状态
        this.downloadPdf.disabled = true;
        this.generatePdf.disabled = false;
        this.generatePdf.textContent = '生成PDF';
        
        // 回到第一步
        this.goToStep(1);
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    // 直接初始化主应用程序
    new PaginatedCoffeeCardEditor();
});