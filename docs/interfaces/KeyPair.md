# Interface: KeyPair

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

## Properties

### privateKey

• **privateKey**: [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)

Private CryptoKey instance to sign the DPoP Proof JWT with.

Its algorithm must be compatible with a supported [JWS \`alg\` Algorithm](../type-aliases/JWSAlgorithm.md).

***

### publicKey

• **publicKey**: [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)

The public CryptoKey instance corresponding to [KeyPair.privateKey](#privatekey)
