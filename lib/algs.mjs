/* eslint-env browser */

const ps = (size) => ({ name: 'RSA-PSS', hash: { name: `SHA-${size}` }, saltLength: size / 8 })
const rs = (size) => ({ name: 'RSASSA-PKCS1-V1_5', hash: { name: `SHA-${size}` } })
const es = (size) => ({ name: 'ECDSA', namedCurve: `P-${size === 512 ? '521' : size}`, hash: { name: `SHA-${size}` } })

const PS256 = ps(256)
const PS384 = ps(384)
const PS512 = ps(512)
const RS256 = rs(256)
const RS384 = rs(384)
const RS512 = rs(512)
const ES256 = es(256)
const ES384 = es(384)
const ES512 = es(512)

export {
  PS256,
  PS384,
  PS512,
  RS256,
  RS384,
  RS512,
  ES256,
  ES384,
  ES512
}
