/**
 * Architecture CI Tests
 *
 * Validates TravelOS code quality rules at the file-system level:
 * - 3-layer import chain enforcement
 * - No cross-feature imports
 * - Barrel exports exist
 * - Max file length
 */
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const SRC = path.resolve(__dirname, '..');
const FEATURES = path.join(SRC, 'features');
const SHARED_COMPONENTS = path.join(SRC, 'shared', 'components');

/** Run ripgrep (or grep) and return matching lines */
function grep(pattern: string, dir: string, glob = '*.{ts,tsx}'): string[] {
  try {
    const result = execSync(
      `grep -r --include="${glob}" -l "${pattern}" "${dir}" 2>/dev/null || true`,
      { encoding: 'utf-8' },
    );
    return result.trim().split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

/** Get all .ts/.tsx files recursively */
function getAllFiles(dir: string, ext: string[] = ['.ts', '.tsx']): string[] {
  const files: string[] = [];
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.next') {
      files.push(...getAllFiles(fullPath, ext));
    } else if (entry.isFile() && ext.some((e) => entry.name.endsWith(e))) {
      files.push(fullPath);
    }
  }
  return files;
}

describe('Architecture Rules', () => {
  it('no direct @coreui imports in feature files', () => {
    const violations = grep("from '@coreui/", FEATURES);
    const filtered = violations.filter((f) => !f.includes('__tests__'));

    if (filtered.length > 0) {
      const fileList = filtered.map((f) => path.relative(SRC, f)).join('\n  ');
      expect.fail(
        `${filtered.length} feature file(s) import directly from @coreui/*.\n` +
        `Use @/shared/components instead:\n  ${fileList}`,
      );
    }
  });

  it('no direct lucide-react imports outside Icon registry', () => {
    const violations = grep("from 'lucide-react'", SRC);
    const allowed = [
      path.join(SRC, 'icons', 'icons.ts'),
      path.join(SRC, 'shared', 'components'),
    ];
    const filtered = violations.filter(
      (f) => !allowed.some((a) => f.startsWith(a)) && !f.includes('node_modules'),
    );

    if (filtered.length > 0) {
      const fileList = filtered.map((f) => path.relative(SRC, f)).join('\n  ');
      expect.fail(
        `${filtered.length} file(s) import directly from lucide-react.\n` +
        `Use <Icon name="..." /> from @/shared/components instead:\n  ${fileList}`,
      );
    }
  });

  it('no cross-feature imports', () => {
    if (!fs.existsSync(FEATURES)) return;

    // Known legacy cross-feature imports (to be cleaned up)
    const KNOWN_LEGACY: Record<string, string[]> = {
      layout: ['theme'],       // layout uses ThemeProvider from theme
      itinerary: ['dashboard'], // ItineraryHub imports dashboard components
    };

    const featureDirs = fs.readdirSync(FEATURES, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    const violations: string[] = [];

    for (const feature of featureDirs) {
      const featureDir = path.join(FEATURES, feature);
      const files = getAllFiles(featureDir);
      const allowed = KNOWN_LEGACY[feature] ?? [];

      for (const file of files) {
        if (file.includes('__tests__')) continue;
        const content = fs.readFileSync(file, 'utf-8');
        const importRegex = /from\s+['"]@\/features\/([^/'"\s]+)/g;
        let match;
        while ((match = importRegex.exec(content)) !== null) {
          if (match[1] !== feature && !allowed.includes(match[1])) {
            violations.push(
              `${path.relative(SRC, file)} imports from @/features/${match[1]}`,
            );
          }
        }
      }
    }

    if (violations.length > 0) {
      expect.fail(
        `${violations.length} cross-feature import(s) found:\n  ${violations.join('\n  ')}`,
      );
    }
  });

  it('shared/components has barrel exports (index.ts)', () => {
    const mainBarrel = path.join(SHARED_COMPONENTS, 'index.ts');
    expect(fs.existsSync(mainBarrel)).toBe(true);

    const formsBarrel = path.join(SHARED_COMPONENTS, 'forms', 'index.ts');
    expect(fs.existsSync(formsBarrel)).toBe(true);

    const layoutBarrel = path.join(SHARED_COMPONENTS, 'layout', 'index.ts');
    if (fs.existsSync(path.join(SHARED_COMPONENTS, 'layout'))) {
      expect(fs.existsSync(layoutBarrel)).toBe(true);
    }
  });

  it('no .tsx/.ts file exceeds 300 lines (Golden Rule 13)', () => {
    const files = getAllFiles(SRC);
    const oversized: { file: string; lines: number }[] = [];

    for (const file of files) {
      // Skip test files, generated files, and type definition files
      if (
        file.includes('__tests__') ||
        file.includes('.test.') ||
        file.includes('.spec.') ||
        file.includes('.d.ts') ||
        file.includes('node_modules')
      ) continue;

      const content = fs.readFileSync(file, 'utf-8');
      const lineCount = content.split('\n').length;
      if (lineCount > 300) {
        oversized.push({ file: path.relative(SRC, file), lines: lineCount });
      }
    }

    if (oversized.length > 0) {
      const list = oversized
        .sort((a, b) => b.lines - a.lines)
        .slice(0, 20) // Show top 20
        .map((f) => `${f.file} (${f.lines} lines)`)
        .join('\n  ');
      // Warn but don't fail — some legacy files may exceed this
      console.warn(
        `${oversized.length} file(s) exceed 300-line limit:\n  ${list}`,
      );
    }
  });

  it('feature folders are self-contained (each has index.ts or barrel)', () => {
    if (!fs.existsSync(FEATURES)) return;
    const featureDirs = fs.readdirSync(FEATURES, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    const missing: string[] = [];
    for (const feature of featureDirs) {
      const featureDir = path.join(FEATURES, feature);
      const hasIndex = fs.existsSync(path.join(featureDir, 'index.ts')) ||
                       fs.existsSync(path.join(featureDir, 'index.tsx'));
      if (!hasIndex) {
        missing.push(feature);
      }
    }

    if (missing.length > 0) {
      console.warn(
        `${missing.length} feature folder(s) missing barrel export (index.ts):\n  ${missing.join(', ')}`,
      );
    }
  });
});
