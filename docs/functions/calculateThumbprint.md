# Function: calculateThumbprint()

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

▸ **calculateThumbprint**(`publicKey`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`\>

Calculates the JWK Thumbprint of the DPoP public key using the SHA-256 hash function for use as
the optional `dpop_jkt` authorization request parameter.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `publicKey` | [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey) |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`\>
