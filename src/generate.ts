import subtleAlg from './algs'

async function generateKeyPair (alg: string) {
  const algorithm: RsaHashedKeyGenParams | EcKeyGenParams = subtleAlg(alg)
  return crypto.subtle.generateKey(algorithm, false, ['sign'])
}

export default generateKeyPair
