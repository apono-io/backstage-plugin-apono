const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');

const versionFilePath = path.join(__dirname, '../src/version.ts');
const content = `export const VERSION = '${packageJson.version}';\n`;

fs.writeFileSync(versionFilePath, content, 'utf-8');

// Stage and commit the version file
require('child_process').execSync('git add src/version.ts');
require('child_process').execSync('git commit -m "chore: update version.ts [skip ci]"');
