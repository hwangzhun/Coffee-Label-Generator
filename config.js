// 简化版咖啡名片编辑器配置文件
// 固定配置，无需用户调整

const SIMPLE_CONFIG = {
    // 图片文件夹路径
    imageFolder: "img/",
    
    // 图片文件名列表（固定）
    imageFiles: [
        "1.jpg",
        "2.jpg", 
        "3.jpg",
        "4.jpg",
        "5.jpg",
        "6.jpg",
        "7.jpg",
        "8.jpg"
    ],
    
    // 固定文字位置（像素）
    // 根据用户提供的精确位置
    textPosition: {
        x: 35.6,
        y: 793.91
    },
    
    // 固定文字样式
    textStyle: {
        fontSize: 21,
        color: "#7f463a",
        fontFamily: "'OPPO Sans', sans-serif",
        letterSpacing: 0
    },
    
    // PDF导出设置
    pdfSettings: {
        pageSize: 'a4',
        orientation: 'portrait',
        cardsPerPage: 8, // 一页8张名片
        cardWidth: 105, // mm
        cardHeight: 74.25, // mm
        margin: 5 // mm
    }
};

// 使用说明：
// 1. 将图片文件放在 img/ 文件夹下
// 2. 图片文件名必须是 1.jpg, 2.jpg, ..., 8.jpg
// 3. 文字位置和样式已固定，无需调整
// 4. 用户只需要选择图片和输入文字内容
