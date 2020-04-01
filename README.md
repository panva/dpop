# DPoP

> Browser-focused implementation of
[OAuth 2.0 Demonstration of Proof-of-Possession at the Application Layer - draft-ietf-oauth-dpop-00](https://tools.ietf.org/html/draft-ietf-oauth-dpop-00).

## Usage

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
  </head>

  <script type="module">
    import DPoP, { generateKeyPair } from 'https://cdn.jsdelivr.net/npm/dpop@^0.5.0'

    const alg = 'ES256' // see below for other supported JWS algorithms

    (async () => {
      const keypair = await generateKeyPair(alg)
      const dpopProofJWT = await DPoP(keypair, alg, 'https://rs.example.com/resource', 'GET')
    })()
  </script>
</html>
```

_Note:_ Storage of the crypto key pair is not included, use your existing abstraction over IndexedDB
to store the CryptoKey instances.


## Supported JWS Algorithms

| JWS Algorithms | Supported ||
| -- | -- | -- |
| ECDSA | ✓ | ES256, ES384, ES512 |
| RSASSA-PSS | ✓ | PS256, PS384, PS512 |
| RSASSA-PKCS1-v1_5 | ✓ | RS256, RS384, RS512 |

Other JWS algorithms are either not eligible for use with DPoP or unsupported by the
[Web Cryptography API](https://www.w3.org/TR/WebCryptoAPI/).


## Prerequisites

Requires [Web Cryptography API](https://www.w3.org/TR/WebCryptoAPI/), specifically:

- [crypto.subtle.`generateKey`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey) - [support table](https://caniuse.com/#feat=mdn-api_subtlecrypto_generatekey)
- [crypto.subtle.`exportKey`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/exportKey) - [support table](https://caniuse.com/#feat=mdn-api_subtlecrypto_exportkey)
- [crypto.subtle.`sign`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/sign) - [support table](https://caniuse.com/#feat=mdn-api_subtlecrypto_sign)
- [crypto.`getRandomValues`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues) - [support table](https://caniuse.com/#feat=mdn-api_crypto_getrandomvalues)
