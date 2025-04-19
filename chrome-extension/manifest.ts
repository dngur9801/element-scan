import { readFileSync } from 'node:fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

const manifest = {
  manifest_version: 3,
  default_locale: 'en',
  name: 'Element Scan',
  browser_specific_settings: {
    gecko: {
      id: 'dngur9801@gmail.com',
      strict_min_version: '109.0',
    },
  },
  version: packageJson.version,
  description: 'Element Scan',
  host_permissions: ['<all_urls>'],
  permissions: [],
  options_page: 'options/index.html',
  background: {
    service_worker: 'background.js',
    type: 'module',
  },
  action: {
    default_popup: 'popup/index.html',
    default_icon: 'icon-34.png',
  },
  chrome_url_overrides: {
    newtab: 'new-tab/index.html',
  },
  icons: {
    128: 'icon-128.png',
  },
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*', '<all_urls>'],
      js: ['content/index.iife.js'],
    },
    {
      matches: ['http://*/*', 'https://*/*', '<all_urls>'],
      js: ['content-ui/index.iife.js'],
    },
    {
      matches: ['http://*/*', 'https://*/*', '<all_urls>'],
      css: ['content.css'],
    },
  ],
  devtools_page: 'devtools/index.html',
  web_accessible_resources: [
    {
      resources: ['*.js', '*.css', '*.svg', 'icon-128.png', 'icon-34.png'],
      matches: ['*://*/*'],
    },
  ],
  side_panel: {
    default_path: 'side-panel/index.html',
  },
} satisfies chrome.runtime.ManifestV3;

export default manifest;
