# Interface: KeyPair

[💗 Help the project](https://github.com/sponsors/panva)

## Table of contents

### Properties

- [privateKey](KeyPair.md#privatekey)
- [publicKey](KeyPair.md#publickey)

## Properties

### privateKey

• **privateKey**: `CryptoKey`

Private
[CryptoKey](https://developer.mozilla.org/en-US/docs/Web/API/CryptoKey)
instance to sign the DPoP Proof JWT with.

Its algorithm must be compatible with a supported
[JWS `alg` Algorithm](../types/JWSAlgorithm.md).

___

### publicKey

• **publicKey**: `CryptoKey`

The public key corresponding to {@link DPoPOptions.privateKey}
