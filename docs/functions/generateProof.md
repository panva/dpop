# Function: generateProof()

[💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

***

▸ **generateProof**(`keypair`, `htu`, `htm`, `nonce`?, `accessToken`?, `additional`?): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`\>

Generates a unique DPoP Proof JWT.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `keypair` | [`KeyPair`](../interfaces/KeyPair.md) |  |
| `htu` | `string` | The HTTP URI (without query and fragment parts) of the request |
| `htm` | `string` | The HTTP method of the request |
| `nonce`? | `string` | Server-provided nonce. |
| `accessToken`? | `string` | Associated access token's value. |
| `additional`? | [`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)\<`string`, [`JsonValue`](../type-aliases/JsonValue.md)\> | Any additional claims. |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`\>
