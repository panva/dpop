import assert from 'node:assert/strict'
import { test } from 'node:test'

import fc from 'fast-check'

import { calculateThumbprint, generateKeyPair, generateProof } from '../build/index.js'

const encoder = new TextEncoder()
const keypair = await generateKeyPair('ES256', { extractable: true })
const exportedJwk = await crypto.subtle.exportKey('jwk', keypair.publicKey)
const publicJwk = Object.fromEntries(
  ['kty', 'crv', 'e', 'n', 'x', 'y']
    .map((member) => [member, exportedJwk[member]])
    .filter(([, value]) => value !== undefined),
)
const options = { numRuns: 100 }

function decode(input) {
  return new Uint8Array(Buffer.from(input, 'base64url'))
}

function decodeJson(input) {
  return JSON.parse(Buffer.from(input, 'base64url').toString())
}

async function digest(input) {
  return Buffer.from(await crypto.subtle.digest('SHA-256', encoder.encode(input))).toString(
    'base64url',
  )
}

const reservedClaims = new Set(['iat', 'jti', 'htm', 'htu', 'nonce', 'ath'])
const additionalClaims = fc.dictionary(
  fc.string({ unit: 'grapheme', maxLength: 24 }).filter((claim) => !reservedClaims.has(claim)),
  fc.jsonValue({ maxDepth: 3, stringUnit: 'grapheme' }),
  { maxKeys: 8, noNullPrototype: true },
)
const nonEmptyStrings = fc.string({ unit: 'grapheme', minLength: 1, maxLength: 128 })

test('generated proofs preserve claims and have valid signatures', async () => {
  await fc.assert(
    fc.asyncProperty(
      nonEmptyStrings,
      nonEmptyStrings,
      fc.option(nonEmptyStrings, { nil: undefined }),
      fc.option(nonEmptyStrings, { nil: undefined }),
      additionalClaims,
      async (htu, htm, nonce, accessToken, additional) => {
        const proof = await generateProof(keypair, htu, htm, nonce, accessToken, additional)
        const [encodedHeader, encodedPayload, encodedSignature] = proof.split('.')
        const header = decodeJson(encodedHeader)
        const payload = decodeJson(encodedPayload)
        const signingInput = encoder.encode(`${encodedHeader}.${encodedPayload}`)
        const normalizedAdditional = JSON.parse(JSON.stringify(additional))

        assert.deepEqual(header, { alg: 'ES256', typ: 'dpop+jwt', jwk: publicJwk })
        assert.equal(payload.htu, htu)
        assert.equal(payload.htm, htm)
        assert.equal(payload.nonce, nonce)
        assert.match(
          payload.jti,
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
        )
        assert.equal(Number.isInteger(payload.iat), true)
        assert.ok(Math.abs(payload.iat - Math.floor(Date.now() / 1000)) <= 1)

        for (const [claim, value] of Object.entries(normalizedAdditional)) {
          assert.deepEqual(payload[claim], value)
        }

        if (accessToken === undefined) {
          assert.equal(Object.hasOwn(payload, 'ath'), false)
        } else {
          assert.equal(payload.ath, await digest(accessToken))
        }

        assert.equal(
          await crypto.subtle.verify(
            { name: 'ECDSA', hash: 'SHA-256' },
            keypair.publicKey,
            decode(encodedSignature),
            signingInput,
          ),
          true,
        )

        const tamperedSignature = decode(encodedSignature)
        tamperedSignature[0] ^= 1
        assert.equal(
          await crypto.subtle.verify(
            { name: 'ECDSA', hash: 'SHA-256' },
            keypair.publicKey,
            tamperedSignature,
            signingInput,
          ),
          false,
        )
      },
    ),
    options,
  )
})

test('mandatory claims override additional claims', async () => {
  await fc.assert(
    fc.asyncProperty(nonEmptyStrings, nonEmptyStrings, async (htu, htm) => {
      const proof = await generateProof(keypair, htu, htm, undefined, undefined, {
        htu: 'overridden',
        htm: 'overridden',
        iat: 0,
        jti: 'overridden',
      })
      const payload = decodeJson(proof.split('.')[1])

      assert.equal(payload.htu, htu)
      assert.equal(payload.htm, htm)
      assert.notEqual(payload.iat, 0)
      assert.notEqual(payload.jti, 'overridden')
    }),
    options,
  )
})

test('additional claims preserve own prototype-named members', async () => {
  const additional = JSON.parse('{"__proto__":{"nested":true}}')
  const proof = await generateProof(
    keypair,
    'https://example.com',
    'GET',
    undefined,
    undefined,
    additional,
  )
  const payload = decodeJson(proof.split('.')[1])

  assert.equal(Object.hasOwn(payload, '__proto__'), true)
  assert.deepEqual(payload.__proto__, { nested: true })
})

test('JWK thumbprints match the canonical public JWK digest', async () => {
  const canonical = JSON.stringify({
    crv: publicJwk.crv,
    kty: publicJwk.kty,
    x: publicJwk.x,
    y: publicJwk.y,
  })
  const expected = await digest(canonical)

  await fc.assert(
    fc.asyncProperty(fc.integer({ min: 1, max: 10 }), async (repetitions) => {
      for (let i = 0; i < repetitions; i++) {
        assert.equal(await calculateThumbprint(keypair.publicKey), expected)
      }
    }),
    { numRuns: 25 },
  )
})
