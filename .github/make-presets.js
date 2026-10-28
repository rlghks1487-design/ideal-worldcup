// presets 폴더를 훑어서 presets.js(준비된 월드컵 목록)를 만드는 프로그램
const fs = require('fs');
const path = require('path');

const IMAGE_TYPES = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.bmp'];
const presets = [];

if (fs.existsSync('presets')) {
  // presets 안의 폴더들 = 월드컵들
  const folders = [];
  for (const entry of fs.readdirSync('presets', { withFileTypes: true })) {
    if (entry.isDirectory()) folders.push(entry.name);
  }
  folders.sort();

  for (const folder of folders) {
    // 폴더 안의 사진들 = 선택지들
    const files = [];
    for (const file of fs.readdirSync(path.join('presets', folder))) {
      const ext = path.extname(file).toLowerCase();
      if (IMAGE_TYPES.includes(ext)) files.push(file);
    }
    files.sort();

    // 사진이 2장보다 적으면 대결을 할 수 없으니 건너뛰기
    if (files.length < 2) continue;

    const items = [];
    for (const file of files) {
      items.push({
        src: ['presets', folder, file].map(encodeURIComponent).join('/'),
        name: path.parse(file).name,
      });
    }
    presets.push({ title: folder, items: items });
  }
}

const text = 'window.PRESETS = ' + JSON.stringify(presets, null, 2) + ';\n';
fs.writeFileSync('presets.js', text);
console.log('준비된 월드컵 ' + presets.length + '개를 presets.js에 저장했어요.');
