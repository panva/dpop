const path = require('path')
const { readFileSync, writeFile } = require('fs')
const { minify } = require('terser')

const minifyOptions = {
  sourceMap: {
    filename: 'index.min.js',
    url: 'index.min.js.map'
  }
}

module.exports.build = async function build ({ cwd, out, options, reporter }) {
  const terserOptions = Object.assign({}, minifyOptions, (options.terserOptions || {}))
  const dir = 'dist-web'
  const indexPath = path.join(path.join(out, dir, 'index.js'))
  const code = readFileSync(indexPath, 'utf-8')
  var result = minify(code, terserOptions)
  if (result.error) {
    throw result.error
  }
  return Promise.all([
    new Promise(resolve => writeFile(path.join(out, dir, terserOptions.sourceMap.filename), result.code, resolve)),
    new Promise(resolve => writeFile(path.join(out, dir, terserOptions.sourceMap.url), result.map, resolve))
  ])
}
