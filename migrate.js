const fs = require('fs');
const path = require('path');

const srcDir = '../digital-passport-fe-old/src/routes';
const destDir = './src/app';

const mappings = {
  'activate.index.tsx': 'activate/page.tsx',
  'activate.scan.tsx': 'activate/scan/page.tsx',
  'onboarding.tsx': 'onboarding/page.tsx',
  'app.tsx': '(app)/layout.tsx',
  'app.index.tsx': '(app)/page.tsx',
  'app.journey.index.tsx': '(app)/journey/page.tsx',
  'app.journey.import.tsx': '(app)/journey/import/page.tsx',
  'app.location.$id.tsx': '(app)/location/[id]/page.tsx',
  'app.notifications.tsx': '(app)/notifications/page.tsx',
  'app.profile.tsx': '(app)/profile/page.tsx',
  'app.scan.tsx': '(app)/scan/page.tsx',
  'app.settings.tsx': '(app)/settings/page.tsx',
  'app.stamps.tsx': '(app)/stamps/page.tsx',
  'app.vouchers.tsx': '(app)/vouchers/page.tsx',
};

function processFile(filename, destFile) {
  let content = fs.readFileSync(path.join(srcDir, filename), 'utf-8');

  // Add "use client"; at the top
  content = `"use client";\n\n` + content;

  // Replace imports
  content = content.replace(/import\s+{([^}]*)}\s+from\s+["']@tanstack\/react-router["'];?/g, (match, p1) => {
    let imports = p1.split(',').map(s => s.trim());
    let res = [];
    if (imports.includes('Link')) {
      res.push(`import Link from "next/link";`);
    }
    if (imports.includes('useNavigate') || imports.includes('useRouter')) {
      res.push(`import { useRouter } from "next/navigation";`);
    }
    if (imports.includes('useParams')) {
      res.push(`import { useParams } from "next/navigation";`);
    }
    if (imports.includes('useSearch')) {
      res.push(`import { useSearchParams } from "next/navigation";`);
    }
    if (imports.includes('Outlet')) {
      // For layout files
    }
    return res.join('\n');
  });

  // Replace Route definition
  content = content.replace(/export\s+const\s+Route\s*=\s*createFileRoute\([^)]+\)\([^)]+\);?/g, '');
  content = content.replace(/export\s+const\s+Route\s*=\s*createFileRoute\([^)]+\)\(\{\s*component:\s*([a-zA-Z0-9_]+)[^}]*\}\);?/g, (m, comp) => {
    return `export default ${comp};`;
  });
  content = content.replace(/export\s+const\s+Route\s*=\s*createFileRoute[^{]+\{[\s\S]*?component:\s*([a-zA-Z0-9_]+),?[\s\S]*?\}\);?/g, (m, comp) => {
      return `export default ${comp};`;
  });

  // Replace Outlet
  content = content.replace(/<Outlet\s*\/?>/g, '{children}');

  // Replace useNavigate
  content = content.replace(/const\s+(\w+)\s*=\s*useNavigate\([^)]*\);?/g, 'const $1 = useRouter();');
  content = content.replace(/(\w+)\(\{?\s*to:\s*(['"`][^'"`]+['"`])\s*\}?\)/g, '$1($2)');
  content = content.replace(/nav\(\{?\s*to:\s*(['"`][^'"`]+['"`])\s*\}?\)/g, 'nav($1)');

  // Replace useParams
  content = content.replace(/const\s+\{\s*([^\}]+)\s*\}\s*=\s*Route\.useParams\(\)/g, 'const { $1 } = useParams() as any');

  // Replace useSearch
  content = content.replace(/const\s+\{\s*([^\}]+)\s*\}\s*=\s*useSearch\([^)]*\);?/g, 'const searchParams = useSearchParams();\n  const loc = searchParams.get("loc");');

  // Replace Link
  content = content.replace(/<Link\s+to=/g, '<Link href=');

  const fullDest = path.join(destDir, destFile);
  fs.mkdirSync(path.dirname(fullDest), { recursive: true });
  fs.writeFileSync(fullDest, content);
}

for (const [src, dest] of Object.entries(mappings)) {
  if (fs.existsSync(path.join(srcDir, src))) {
    processFile(src, dest);
    console.log(`Migrated ${src} -> ${dest}`);
  }
}
