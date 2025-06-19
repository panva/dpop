# dpop

> OAuth 2.0 Demonstration of Proof-of-Possession at the Application Layer ([DPoP][RFC9449]) for JavaScript Runtimes

## [💗 Help the project](https://github.com/sponsors/panva)

## Dependencies: 0

## [API Reference](docs/README.md)

`dpop` is distributed via [npmjs.com](https://www.npmjs.com/package/dpop), [jsdelivr.com](https://www.jsdelivr.com/package/npm/dpop), and [github.com](https://github.com/panva/dpop).

## Example

### ESM import[^cjs]

```ts
import * as DPoP from 'dpop'
```

### DPoP Key Pair generation

```ts
const keypair = await DPoP.generateKeyPair('ES256', { extractable: false })
```

### AS proof generation

```ts
let nonce!: string | undefined
const proof = await DPoP.generateProof(keypair, 'https://as.example.com/token', 'POST', nonce)
```

### AS Authorization Code Binding via `dpop_jkt`

```ts
const dpop_jkt = await DPoP.calculateThumbprint(keyPair.publicKey)
```

### AS proof generation

```ts
let nonce!: string | undefined
let accessToken!: string

const proof = await DPoP.generateProof(
  keypair,
  'https://rs.example.com/api',
  'GET',
  nonce,
  accessToken,
)
```

## Supported Runtimes

The supported JavaScript runtimes include those that support the utilized Web API globals and standard built-in objects. These are _(but are not limited to)_:

- Browsers
- Bun
- Cloudflare Workers
- Deno
- Electron
- Node.js[^nodejs]
- Vercel's Edge Runtime

## Supported Versions

| Version                                         | Security Fixes 🔑 | Other Bug Fixes 🐞 | New Features ⭐ |
| ----------------------------------------------- | ----------------- | ------------------ | --------------- |
| [v2.x](https://github.com/panva/dpop/tree/v2.x) | [Security Policy] | ✅                 | ✅              |

[rfc9449]: https://www.rfc-editor.org/rfc/rfc9449.html
[Security Policy]: https://github.com/panva/dpop/security/policy

[^cjs]: CJS style `let dpop = require('dpop')` is possible in Node.js versions where the `require(esm)` feature is enabled by default (^20.19.0 || ^22.12.0 || >= 23.0.0).

[^nodejs]: Node.js v20.x as baseline is required
