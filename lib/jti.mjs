/* eslint-env browser */

const charset = '_-0123456789aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ'

function jti () {
  let size = 21
  var id = ''
  var bytes = crypto.getRandomValues(new Uint8Array(size))
  while (0 < size--) { // eslint-disable-line yoda
    id += charset[bytes[size] & 63]
  }
  return id
}

export default jti
