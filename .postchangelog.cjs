const { readFileSync, writeFileSync } = require('node:fs')

const CHANGELOG = './CHANGELOG.md'

function formatChangelog(changelog) {
  return changelog
    .replace(/^### \[/gm, '## [')
    .replace(/([^\n])\n(?=## )/g, '$1\n\n')
}

function main() {
  writeFileSync(CHANGELOG, formatChangelog(readFileSync(CHANGELOG, 'utf8')))
}

module.exports = { formatChangelog }

if (require.main === module) {
  main()
}
