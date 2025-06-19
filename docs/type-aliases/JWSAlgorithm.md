# Type Alias: JWSAlgorithm

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

• **JWSAlgorithm**: `"ES256"` \| `"Ed25519"` \| `"RS256"` \| `"PS256"`

Supported JWS `alg` Algorithm identifiers.

## Examples

```ts
interface ES256Algorithm extends EcKeyAlgorithm {
  name: 'ECDSA'
  namedCurve: 'P-256'
}
```

```ts
interface Ed25519Algorithm extends Algorithm {
  name: 'Ed25519'
}
```

```ts
interface PS256Algorithm extends RsaHashedKeyAlgorithm {
  name: 'RSA-PSS'
  hash: { name: 'SHA-256' }
}
```

```ts
interface RS56Algorithm extends RsaHashedKeyAlgorithm {
  name: 'RSASSA-PKCS1-v1_5'
  hash: { name: 'SHA-256' }
}
```
