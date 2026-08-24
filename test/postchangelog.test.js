import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import test from 'node:test'

const require = createRequire(import.meta.url)
const { formatChangelog } = require('../.postchangelog.cjs')

test('postchangelog separates linked and unlinked release headings', () => {
  const input = `# Changelog

### [2.1.2] (2026-08-24)

### Fixes

* preserve special claim names
## [2.1.1] (2025-07-02)

* previous change
## 2.0.0 (2024-01-01)
`
  const expected = `# Changelog

## [2.1.2] (2026-08-24)

### Fixes

* preserve special claim names

## [2.1.1] (2025-07-02)

* previous change

## 2.0.0 (2024-01-01)
`

  assert.equal(formatChangelog(input), expected)
  assert.equal(formatChangelog(expected), expected)
})
