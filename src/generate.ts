import alg from './algs'

async function generateKeyPair (jwsAlgorithm: string) {
  let algorithm: RsaHashedKeyGenParams | EcKeyGenParams
  if (!jwsAlgorithm.startsWith('ES')) {
    algorithm = {
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      ...alg(jwsAlgorithm)
    }
  } else {
    algorithm = alg(jwsAlgorithm)
  }

  return crypto.subtle.generateKey(algorithm, false, ['sign'])
}

export default generateKeyPair
