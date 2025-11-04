const fs = require('fs')
const path = require('path')

// This script scans the workspace for files under `src/` that are not
// present in the safe keep list and prints them. To actually delete
// them, re-run with the `--apply` flag. This is intentionally
// non-destructive so you can review before deleting anything.

const keep = new Set([
  // core new files we want to keep (relative to repo root)
  path.join('src', 'main.jsx'),
  path.join('src', 'App.jsx'),
  path.join('src', 'theme.js'),
  path.join('src', 'assets', 'css', 'theme.css'),
  path.join('src', 'components', 'common', 'Navbar.jsx'),
  path.join('src', 'components', 'common', 'Footer.jsx'),
  path.join('src', 'components', 'common', 'ThemeProvider.jsx'),
  path.join('src', 'pages', 'Home', 'Index.jsx'),
  path.join('src', 'pages', 'Home', 'About.jsx'),
  path.join('src', 'pages', 'Home', 'Contact.jsx'),
  path.join('src', 'pages', 'Home', 'LoginRegister', 'Login.jsx'),
  path.join('src', 'pages', 'Home', 'LoginRegister', 'Register.jsx'),
  path.join('src', 'pages', 'AdminDashboard', 'Index.jsx'),
  path.join('src', 'pages', 'BuyerDashboard', 'Index.jsx'),
  path.join('src', 'pages', 'FarmerDashboard', 'Index.jsx'),
  path.join('src', 'pages', 'GlobalMarketplace', 'Categories.jsx'),
  path.join('src', 'pages', 'NotFound.jsx'),
  path.join('scripts', 'prune_old.js'),
  path.join('scripts', 'fetch_root.js'),
  path.join('RUNNING.md')
])

function listAllFiles(dir) {
  if (!fs.existsSync(dir)) return []
  const out = []
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    const stat = fs.statSync(full)
    if (stat.isDirectory()) {
      out.push(...listAllFiles(full))
    } else {
      out.push(full)
    }
  }
  return out
}

const srcDir = path.join(__dirname, '..', 'src')
const all = listAllFiles(srcDir).map(f => path.relative(path.join(__dirname, '..'), f))
const candidates = all.filter(p => !keep.has(p))

console.log('Files under src/ not in keep-list:')
candidates.forEach(c => console.log('  ', c))

if (process.argv.includes('--apply')) {
  console.log('\n--apply provided, deleting above files...')
  for (const rel of candidates) {
    const full = path.join(__dirname, '..', rel)
    try {
      fs.unlinkSync(full)
      console.log('Deleted file', rel)
    } catch (err) {
      // try rmdir if it's a directory
      try { fs.rmdirSync(full) ; console.log('Removed dir', rel) } catch (e) { console.error('Failed to remove', rel, err.message) }
    }
  }
  console.log('Deletion pass complete. You may need to remove empty directories manually.')
} else {
  console.log('\nRun `node scripts/prune_old.js --apply` to delete these files.')
}
