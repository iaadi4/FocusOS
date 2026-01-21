
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const firefoxDistDir = path.join(rootDir, 'dist-firefox');

// Recursive copy function
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('Building for Firefox...');

// 1. Clean/Create dist-firefox
if (fs.existsSync(firefoxDistDir)) {
  fs.rmSync(firefoxDistDir, { recursive: true, force: true });
}
fs.mkdirSync(firefoxDistDir);

// 2. Copy dist content
copyRecursiveSync(distDir, firefoxDistDir);

// 3. Modify manifest.json for Firefox 
// (MV3 in Firefox supports background.scripts, which is often more stable for ported extensions than service_worker)
const manifestPath = path.join(firefoxDistDir, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// Switch from service_worker to scripts
if (manifest.background && manifest.background.service_worker) {
  manifest.background.scripts = [manifest.background.service_worker];
  delete manifest.background.service_worker;
  // manifest.background.type should be preserved if it is 'module'
  // Firefox supports type: module for background scripts in MV3 (since 112)
}

// Add strict_min_version and data_collection_permissions for Firefox
if (!manifest.browser_specific_settings) {
  manifest.browser_specific_settings = {};
}
if (!manifest.browser_specific_settings.gecko) {
  manifest.browser_specific_settings.gecko = { id: "focus-os@example.com" }; // You should replace this ID
}
// 112.0 supports background.type: module
manifest.browser_specific_settings.gecko.strict_min_version = "112.0";
// Declare no data collection
manifest.browser_specific_settings.gecko.data_collection_permissions = { required: ["none"] };


// Write back manifest
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log('Firefox build created in dist-firefox/');
