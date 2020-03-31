const charset = '_-0123456789aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ'

export default () => {
  let size = 21
  var id = ''
  var bytes = crypto.getRandomValues(new Uint8Array(size))
  while (0 < size--) {
    id += charset[bytes[size] & 63]
  }
  return id
}
