/**
 * Parcel / build:static 输出 dist 后，补充服务端与未打包的前端文件。
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

if (!fs.existsSync(dist)) {
  console.error('dist/ 不存在，请先执行 npm run build 或 npm run build:static');
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const prod = {
  name: pkg.name,
  version: pkg.version,
  description: pkg.description,
  scripts: { start: 'node server.js' },
  dependencies: pkg.dependencies,
  keywords: pkg.keywords,
  author: pkg.author,
  license: pkg.license
};
fs.writeFileSync(path.join(dist, 'package.json'), JSON.stringify(prod, null, 2));
console.log('✅ dist/package.json');

for (const f of ['server.js', 'server-cos.js', 'config.js']) {
  const src = path.join(root, f);
  try {
    fs.copyFileSync(src, path.join(dist, f));
    console.log('✅', f);
  } catch {
    console.log('⚠️', f, 'not found');
  }
}

for (const dir of ['log']) {
  try {
    copyDir(path.join(root, dir), path.join(dist, dir));
    console.log('✅ dir:', dir + '/');
  } catch (e) {
    console.log('⚠️ dir:', dir, e.message);
  }
}

const frontendExtras = [
  'logger.js',
  'cos-api-utils.js',
  'cos-utils.js',
  'name-mapping.json',
  'config.local.js'
];
for (const f of frontendExtras) {
  const src = path.join(root, f);
  try {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(dist, f));
      console.log('✅', f);
    } else {
      console.log('⚠️', f, 'not found (optional)');
    }
  } catch (e) {
    console.log('❌', f, e.message);
  }
}

console.log('📦 dist 补充文件完成');
