/**
 * 将前端按「未打包」方式复制到 dist/（保留独立 config.js、logger.js 等）。
 * 与 parcel build 二选一：需要单独文件或部署后改 config 时用本脚本。
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');

const FILES_REQUIRED = [
  'index.html',
  'style.css',
  'icon.svg',
  'config.local.js',
  'config.js',
  'logger.js',
  'cos-api-utils.js',
  'cos-utils.js',
  'script.js',
];

const FILES_OPTIONAL = ['name-mapping.json'];

if (fs.existsSync(dist)) {
  fs.rmSync(dist, { recursive: true, force: true });
}
fs.mkdirSync(dist, { recursive: true });

for (const f of FILES_REQUIRED) {
  const src = path.join(root, f);
  if (!fs.existsSync(src)) {
    console.error('缺少必要文件:', f);
    process.exit(1);
  }
  fs.copyFileSync(src, path.join(dist, f));
  console.log('✅', f);
}

for (const f of FILES_OPTIONAL) {
  const src = path.join(root, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(dist, f));
    console.log('✅', f, '(optional)');
  }
}

console.log('📦 静态前端已输出到', dist);
