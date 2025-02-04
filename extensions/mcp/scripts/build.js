import { mkdir, cp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import AdmZip from 'adm-zip';

async function build() {
  try {
    // Create builtin directory
    const builtinDir = join(process.cwd(), 'builtin', 'mcp');
    await mkdir(builtinDir, { recursive: true });

    // Copy necessary files
    await cp(join(process.cwd(), 'dist'), join(builtinDir, 'dist'), { recursive: true });
    await cp(join(process.cwd(), 'package.json'), join(builtinDir, 'package.json'));

    // Create zip file
    const zip = new AdmZip();
    zip.addLocalFolder(builtinDir);
    zip.writeZip(join(process.cwd(), 'mcp.cdix'));

    // Clean up builtin directory
    await rm(builtinDir, { recursive: true, force: true });

    console.log('Successfully created mcp.cdix');
  } catch (error) {
    console.error('Failed to build extension:', error);
    process.exit(1);
  }
}

build();
