# DPoP

> Browser-focused implementation of
[OAuth 2.0 Demonstration of Proof-of-Possession at the Application Layer - draft-ietf-oauth-dpop-04](https://tools.ietf.org/html/draft-ietf-oauth-dpop-04).

## Usage

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>it's dpop time!</title>
    <script type="module">
      import DPoP, { generateKeyPair } from 'https://cdn.jsdelivr.net/npm/dpop@^0.6.1';

      const alg = 'ES256'; // see below for other supported JWS algorithms
      
      (async () => {
        const keypair = await generateKeyPair(alg);
        
        // Access Token Request
        const accessTokenRequestProof = await DPoP(keypair, alg, 'https://op.example.com/token', 'POST');

        // Protected Resource Access
        const accessTokenValue = 'W0lFSOAgL4oxWwnFtigwmXtL3tHNDjUCXVRasB3hQWahsVvDb0YX1Q2fk7rMJ-oy';
        const protectedResourceAccessProof = await DPoP(keypair, alg, 'https://rs.example.com/resource', 'GET', accessTokenValue);
      })();
    </script>
  </head>
</html>
```

_Note:_ Storage of the crypto key pair is not included, use your existing abstraction over IndexedDB
to store the CryptoKey instances.

## API

### default module export

> function DPoP(keypair: [CryptoKeyPair](https://developer.mozilla.org/en-US/docs/Web/API/CryptoKeyPair), alg: string, htu: string, htm: string, accessToken?: string, additional?: object) => Promise&lt;string&gt;;

### generateKeyPair named export

> function generateKeyPair(alg: string): Promise&lt;[CryptoKeyPair](https://developer.mozilla.org/en-US/docs/Web/API/CryptoKeyPair)&gt;

## Server-Provided Nonce

```js
// Access Token Request with Authorization Server-Provided Nonce
const accessTokenRequestProof = await DPoP(keypair, alg, 'https://op.example.com/token', 'POST', undefined, { nonce: 'eyJ7S_zG.eyJH0-Z.HX4w-7v' });

// Protected Resource Access with Resource Server-Provided Nonce
const accessTokenValue = 'W0lFSOAgL4oxWwnFtigwmXtL3tHNDjUCXVRasB3hQWahsVvDb0YX1Q2fk7rMJ-oy';
const protectedResourceAccessProof = await DPoP(keypair, alg, 'https://rs.example.com/resource', 'GET', accessTokenValue, { nonce: 'eyJ7S_zG.eyJH0-Z.HX4w-7v' });
```


## Supported JWS Algorithms

| JWS Algorithms | Supported ||
| -- | -- | -- |
| ECDSA | ✓ | ES256, ES384, ES512 |
| RSASSA-PSS | ✓ | PS256, PS384, PS512 |
| RSASSA-PKCS1-v1_5 | ✓ | RS256, RS384, RS512 |
| Edwards-curve DSA | ✓ | EdDSA |

Other JWS algorithms are either not eligible for use with DPoP or unsupported by the
[Web Cryptography API](https://w3c.github.io/webcrypto/).


## Prerequisites

Requires [Web Cryptography API](https://w3c.github.io/webcrypto/), specifically:

- [crypto.subtle.`generateKey`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey) - [support table](https://caniuse.com/#feat=mdn-api_subtlecrypto_generatekey)
- [crypto.subtle.`exportKey`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/exportKey) - [support table](https://caniuse.com/#feat=mdn-api_subtlecrypto_exportkey)
- [crypto.subtle.`sign`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/sign) - [support table](https://caniuse.com/#feat=mdn-api_subtlecrypto_sign)
- [crypto.subtle.`digest`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest) - [support table](https://caniuse.com/#feat=mdn-api_subtlecrypto_digest)
- [crypto.`getRandomValues`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues) - [support table](https://caniuse.com/#feat=mdn-api_crypto_getrandomvalues)
