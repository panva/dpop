# Function: default

[💗 Help the project](https://github.com/sponsors/panva)

▸ **default**(`keypair`, `htu`, `htm`, `nonce?`, `accessToken?`, `additional?`): `Promise`<`string`\>

Generates a unique DPoP Proof JWT.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `keypair` | [`KeyPair`](../interfaces/KeyPair.md) |  |
| `htu` | `string` | The HTTP URI (without query and fragment parts) of the request |
| `htm` | `string` | The HTTP method of the request |
| `nonce?` | `string` | Server-provided nonce. |
| `accessToken?` | `string` | Associated access token's value. |
| `additional?` | `Record`<`string`, [`JsonValue`](../types/JsonValue.md)\> | Any additional claims. |

#### Returns

`Promise`<`string`\>
