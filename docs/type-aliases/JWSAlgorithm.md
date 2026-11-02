# Type Alias: JWSAlgorithm

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

• **JWSAlgorithm** = `"ES256"` \| `"Ed25519"` \| `"RS256"` \| `"PS256"`

Supported JWS `alg` Algorithm identifiers.

## Examples

**CryptoKey algorithm for the ES256 JWS Algorithm Identifier**

```ts
interface ES256Algorithm extends EcKeyAlgorithm {
  name: 'ECDSA'
  namedCurve: 'P-256'
}
```

**CryptoKey algorithm for the Ed25519 JWS Algorithm Identifier**

```ts
interface Ed25519Algorithm extends Algorithm {
  name: 'Ed25519'
}
```

**CryptoKey algorithm for the PS256 JWS Algorithm Identifier**

```ts
interface PS256Algorithm extends RsaHashedKeyAlgorithm {
  name: 'RSA-PSS'
  hash: { name: 'SHA-256' }
}
```

**CryptoKey algorithm for the RS256 JWS Algorithm Identifier**

```ts
interface RS56Algorithm extends RsaHashedKeyAlgorithm {
  name: 'RSASSA-PKCS1-v1_5'
  hash: { name: 'SHA-256' }
}
```
