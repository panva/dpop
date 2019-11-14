# DPoP for the browser

Implementation of https://tools.ietf.org/html/draft-fett-oauth-dpop-04

Requires WebCrypto API

- [`window.crypto.subtle.generateKey`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey)
- [`window.crypto.subtle.exportKey`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/exportKey)
- [`window.crypto.subtle.sign`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/sign)
- [`window.crypto.getRandomValues`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues)

Supports the following JWS algorithms: PS256, PS384, PS512, RS256, RS384, RS512, ES256, ES384, ES512

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
  </head>

  <script type="module">
    import DPoP, { generateKeyPair } from './lib/index.mjs'

    (async () => {
      const alg = 'ES256'
      const keypair = await generateKeyPair(alg)
      const dpopToken = await DPoP(keypair, alg, 'https://rs.example.com/resource', 'GET')
    })()
  </script>
</html>

```

Storage of the keypair is not included, use your existing abstraction over IndexedDB to store the keypair instances.
