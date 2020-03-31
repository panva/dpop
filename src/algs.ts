const ps = (hash: number) => ({ name: 'RSA-PSS', hash: { name: `SHA-${hash}` }, saltLength: hash / 8 })
const rs = (hash: number) => ({ name: 'RSASSA-PKCS1-V1_5', hash: { name: `SHA-${hash}` } })
const es = (hash: number, namedCurve: string) => ({ name: 'ECDSA', namedCurve, hash: { name: `SHA-${hash}` } })

const PS256 = ps(256)
const PS384 = ps(384)
const PS512 = ps(512)
const RS256 = rs(256)
const RS384 = rs(384)
const RS512 = rs(512)
const ES256 = es(256, 'P-256')
const ES384 = es(384, 'P-384')
const ES512 = es(512, 'P-521')

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
