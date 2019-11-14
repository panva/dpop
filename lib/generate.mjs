/* eslint-env browser */

import * as algs from './algs.mjs'

async function generateKeyPair (alg) {
  if (!algs[alg]) {
    throw new TypeError('unrecognized or unsupported JWS algorithm')
  }

  if (!alg.startsWith('ES')) {
    alg = {
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      ...algs[alg]
    }
  } else {
    alg = algs[alg]
  }

  return crypto.subtle.generateKey(alg, false, ['sign'])
}

export default generateKeyPair
