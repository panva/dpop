import JWT from './jwt'
import jti from './jti'

const iat = () => Date.now() / 1000 | 0

async function toJWK(publicKey: CryptoKey) {
  const { alg, ext, key_ops, ...jwk } = await crypto.subtle.exportKey('jwk', publicKey)
  return jwk
}

export default async (keypair: CryptoKeyPair, alg: string, htu: string, htm: string, additional?: object) => {
  const jwk = await toJWK(keypair.publicKey)

  return JWT(
    keypair.privateKey,
    { typ: 'dpop+jwt', alg, jwk },
    { ...additional, iat: iat(), jti: jti(), htu, htm }
  )
}
