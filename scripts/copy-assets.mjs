import fs from 'fs';
import path from 'path';

const brainDir = 'C:\\Users\\payal\\.gemini\\antigravity-ide\\brain\\4c7fa6aa-cce9-435a-802b-47d7e0b8f4b9';
const targetDir = path.join(process.cwd(), 'public', 'assets', 'products');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const files = fs.readdirSync(brainDir);

const mapping = {};

files.forEach(file => {
  if (file.endsWith('.jpg') || file.endsWith('.png')) {
    if (file.startsWith('bracelet_1')) mapping['bracelet-1.jpg'] = file;
    if (file.startsWith('bracelet_2')) mapping['bracelet-2.jpg'] = file;
    if (file.startsWith('bracelet_3')) mapping['bracelet-3.jpg'] = file;
    if (file.startsWith('bracelet_4')) mapping['bracelet-4.jpg'] = file;
    if (file.startsWith('bracelet_5')) mapping['bracelet-5.jpg'] = file;
    
    if (file.startsWith('keychain_1')) mapping['keychain-1.jpg'] = file;
    if (file.startsWith('keychain_2')) mapping['keychain-2.jpg'] = file;
    if (file.startsWith('keychain_3')) mapping['keychain-3.jpg'] = file;
    if (file.startsWith('keychain_4')) mapping['keychain-4.jpg'] = file;
    if (file.startsWith('keychain_5')) mapping['keychain-5.jpg'] = file;

    if (file.startsWith('mobile_1')) mapping['mobile-1.jpg'] = file;
    if (file.startsWith('mobile_2')) mapping['mobile-2.jpg'] = file;
  }
});

// Write copies
for (const [targetName, sourceFile] of Object.entries(mapping)) {
  fs.copyFileSync(path.join(brainDir, sourceFile), path.join(targetDir, targetName));
  console.log(`Copied ${sourceFile} -> ${targetName}`);
}

// Map fallbacks for 3-5 mobile keychains if needed
if (mapping['mobile-1.jpg']) {
  if (!fs.existsSync(path.join(targetDir, 'mobile-3.jpg'))) {
    fs.copyFileSync(path.join(brainDir, mapping['mobile-1.jpg']), path.join(targetDir, 'mobile-3.jpg'));
  }
}
if (mapping['mobile-2.jpg']) {
  if (!fs.existsSync(path.join(targetDir, 'mobile-4.jpg'))) {
    fs.copyFileSync(path.join(brainDir, mapping['mobile-2.jpg']), path.join(targetDir, 'mobile-4.jpg'));
  }
}
if (mapping['keychain-1.jpg']) {
  if (!fs.existsSync(path.join(targetDir, 'mobile-5.jpg'))) {
    fs.copyFileSync(path.join(brainDir, mapping['keychain-1.jpg']), path.join(targetDir, 'mobile-5.jpg'));
  }
}

console.log('Successfully initialized 15 product images in public/assets/products');
