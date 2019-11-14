/* eslint-env browser */

import * as base64url from './base64url.mjs'
import * as algs from './algs.mjs'

const utf8ToUint8Array = (str) => {
  return base64url.decode(btoa(unescape(encodeURIComponent(str))))
}

async function JWT (privateKey, header, payload) {
  const { alg } = header

  if (!algs[alg]) {
    throw new TypeError('unrecognized or unsupported JWS algorithm')
  }

  payload = JSON.stringify(payload)
  header = JSON.stringify(header)

  const partialToken = [
    base64url.encode(utf8ToUint8Array(header)),
    base64url.encode(utf8ToUint8Array(payload))
  ].join('.')

  const characters = payload.split('')
  const it = utf8ToUint8Array(payload).entries()
  let i = 0
  const result = []

  let current
  while (!(current = it.next()).done) {
    result.push([current.value[1], characters[i]])
    i++
  }

  const messageAsUint8Array = utf8ToUint8Array(partialToken)
  const signature = await crypto.subtle.sign(algs[alg], privateKey, messageAsUint8Array)
  const signatureAsBase64 = base64url.encode(new Uint8Array(signature))

  return `${partialToken}.${signatureAsBase64}`
}

export default JWT
