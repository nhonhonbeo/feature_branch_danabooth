const fs = require('fs');
const glob = require('glob');

const files = [
  'src/app/(app)/scan/page.tsx',
  'src/app/(app)/settings/page.tsx',
  'src/app/activate/page.tsx',
  'src/app/activate/scan/page.tsx',
  'src/app/onboarding/page.tsx'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/nav\(['"]([^'"]+)['"]\)/g, 'nav.push("$1")');
  content = content.replace(/<Navigate to="\/" \/>/g, 'null; router.push("/");');
  fs.writeFileSync(f, content);
});
