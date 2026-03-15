#!/usr/bin/env node

/**
 * Smart Multi-Repo Commit Script — Option B
 *
 * Usage:  npm run commit "your message"
 *
 * Auto-detects which folders changed and commits to correct repo:
 *
 *   SharedCore/    → github.com/kmrjyoti-web/sharedcode
 *   travelOS-web/  → github.com/kmrjyoti-web/travelWebApp  [travelOS-web]
 *   products/      → github.com/kmrjyoti-web/travelWebApp  [products]
 *   root files     → github.com/kmrjyoti-web/travelWebApp  [root]
 *
 * Both repos get pushed automatically.
 * Notion log entry is printed at the end — copy it to Notion.
 */

const { execSync } = require('child_process');
const path = require('path');

const ROOT         = path.resolve(__dirname, '..');
const SHAREDCORE   = path.join(ROOT, 'SharedCore');
const message      = process.argv[2];

if (!message) {
  console.error('\n❌  Usage: npm run commit "your commit message"\n');
  process.exit(1);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function run(cmd, cwd = ROOT) {
  try {
    return execSync(cmd, { cwd, encoding: 'utf8', stdio: 'pipe' }).trim();
  } catch {
    return '';
  }
}

function runLoud(cmd, cwd = ROOT) {
  execSync(cmd, { cwd, stdio: 'inherit' });
}

function gitStatus(cwd) {
  return run('git status --porcelain', cwd);
}

function hasChanges(cwd) {
  return gitStatus(cwd).length > 0;
}

// Check if any changed files in MyNodeProject start with a given folder
function changedIn(folder) {
  return gitStatus(ROOT).split('\n').some(line => {
    const file = line.slice(3).trim();
    return file.startsWith(folder);
  });
}

// Root-level changed files (not in travelOS-web/ or products/)
function rootChangedFiles() {
  return gitStatus(ROOT)
    .split('\n')
    .map(l => l.slice(3).trim())
    .filter(f => f && !f.startsWith('travelOS-web') && !f.startsWith('products'));
}

// ─── Detect what changed ─────────────────────────────────────────────────────

const changed = {
  sharedCore : hasChanges(SHAREDCORE),
  travelOsWeb: changedIn('travelOS-web'),
  products   : changedIn('products'),
  root       : rootChangedFiles().length > 0,
};

const myProjectChanged = changed.travelOsWeb || changed.products || changed.root;

if (!changed.sharedCore && !myProjectChanged) {
  console.log('\n✅  Nothing to commit — all repos are clean.\n');
  process.exit(0);
}

// ─── Print plan ───────────────────────────────────────────────────────────────

console.log('\n🔍  Changes detected:');
if (changed.sharedCore)  console.log('   📦  SharedCore/        → SHAREDCORE repo');
if (changed.travelOsWeb) console.log('   🌐  travelOS-web/      → MyNodeProject repo');
if (changed.products)    console.log('   🛍️   products/           → MyNodeProject repo');
if (changed.root)        console.log('   📁  root files          → MyNodeProject repo');
console.log('');

const fullMessage = `${message}\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`;

// ─── Step 1: Commit SharedCore ────────────────────────────────────────────────

if (changed.sharedCore) {
  console.log('━━━  [SharedCore] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  try {
    runLoud('git add -A', SHAREDCORE);
    runLoud(`git commit -m "${fullMessage}"`, SHAREDCORE);
    runLoud('git push', SHAREDCORE);
    console.log('✅  SharedCore committed & pushed → github.com/kmrjyoti-web/sharedcode\n');
  } catch (e) {
    console.error('❌  SharedCore commit failed:', e.message, '\n');
  }
}

// ─── Step 2: Commit MyNodeProject ────────────────────────────────────────────

if (myProjectChanged) {
  const scopes = [];
  if (changed.travelOsWeb) scopes.push('travelOS-web');
  if (changed.products)    scopes.push('products');
  if (changed.root)        scopes.push('root');

  const scopeLabel  = scopes.join(', ');
  const commitMsg   = `[${scopeLabel}] ${fullMessage}`;

  console.log(`━━━  [MyNodeProject: ${scopeLabel}] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  try {
    if (changed.travelOsWeb) runLoud('git add travelOS-web/', ROOT);
    if (changed.products)    runLoud('git add products/', ROOT);
    if (changed.root) {
      const files = rootChangedFiles();
      if (files.length) runLoud(`git add ${files.map(f => `"${f}"`).join(' ')}`, ROOT);
    }

    runLoud(`git commit -m "${commitMsg}"`, ROOT);
    runLoud('git push', ROOT);
    console.log(`✅  MyNodeProject committed & pushed → github.com/kmrjyoti-web/travelWebApp\n`);
  } catch (e) {
    console.error('❌  MyNodeProject commit failed:', e.message, '\n');
  }
}

// ─── Step 3: Notion log ───────────────────────────────────────────────────────

const now     = new Date();
const dateStr = now.toISOString().split('T')[0];
const timeStr = now.toTimeString().slice(0, 5);

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📋  NOTION LOG — copy this entry:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`📅  ${dateStr} ${timeStr}`);
console.log(`💬  ${message}`);
if (changed.sharedCore)  console.log(`📦  SharedCore  → github.com/kmrjyoti-web/sharedcode`);
if (myProjectChanged) {
  const scopes = [];
  if (changed.travelOsWeb) scopes.push('travelOS-web');
  if (changed.products)    scopes.push('products');
  if (changed.root)        scopes.push('root');
  console.log(`🌐  MyNodeProject [${scopes.join(', ')}] → github.com/kmrjyoti-web/travelWebApp`);
}
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
