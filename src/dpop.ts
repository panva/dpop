import JWT from './jwt'
import jti from './jti'

const iat = () => Date.now() / 1000 | 0

async function toJWK(publicKey: CryptoKey) {
  const { alg, ext, key_ops, ...jwk } = await crypto.subtle.exportKey('jwk', publicKey)
  return jwk
}

export default async (keypair: CryptoKeyPair, alg: string, uri: string, method: string, additional?: object) => {
  if (typeof keypair !== 'object' || !keypair) {
    throw new TypeError('"keypair" argument must be an object')
  }

  const { privateKey, publicKey } = keypair

  if (!(privateKey instanceof CryptoKey) || privateKey.type !== 'private') {
    throw new TypeError('"keypair.privateKey" must be a private CryptoKey instance')
  }

  if (!(publicKey instanceof CryptoKey) || publicKey.type !== 'public') {
    throw new TypeError('"keypair.publicKey" must be a public CryptoKey instance')
  }

  const jwk = await toJWK(publicKey)

  return JWT(
    privateKey,
    { typ: 'dpop+jwt', alg, jwk },
    { ...additional, iat: iat(), jti: jti(), htu: uri, htm: method }
  )
}
