import * as algs from './algs'

async function generateKeyPair (alg: string) {
  if (!algs[alg]) {
    throw new TypeError('unrecognized or unsupported JWS algorithm')
  }

  let algorithm: RsaHashedKeyGenParams | EcKeyGenParams
  if (!alg.startsWith('ES')) {
    algorithm = {
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      ...algs[alg]
    }
  } else {
    algorithm = algs[alg]
  }

  return crypto.subtle.generateKey(algorithm, false, ['sign'])
}

export default generateKeyPair
