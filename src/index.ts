export type JsonObject = { [Key in string]?: JsonValue }
export type JsonArray = JsonValue[]
export type JsonPrimitive = string | number | boolean | null
export type JsonValue = JsonPrimitive | JsonObject | JsonArray

const encoder = new TextEncoder()
const decoder = new TextDecoder()

function buf(input: string): Uint8Array
function buf(input: Uint8Array): string
function buf(input: string | Uint8Array) {
  if (typeof input === 'string') {
    return encoder.encode(input)
  }

  return decoder.decode(input)
}

interface DPoPJwtHeaderParameters {
  alg: JWSAlgorithm
  typ: string
  jwk: JsonWebKey
}

function checkRsaKeyAlgorithm(algorithm: RsaKeyAlgorithm) {
  if (typeof algorithm.modulusLength !== 'number' || algorithm.modulusLength < 2048) {
    throw new OperationProcessingError(`${algorithm.name} modulusLength must be at least 2048 bits`)
  }
}

function subtleAlgorithm(key: CryptoKey): AlgorithmIdentifier | RsaPssParams | EcdsaParams {
  switch (key.algorithm.name) {
    case 'ECDSA':
      return <EcdsaParams>{ name: key.algorithm.name, hash: 'SHA-256' }
    case 'RSA-PSS':
      checkRsaKeyAlgorithm(<RsaKeyAlgorithm>key.algorithm)
      return <RsaPssParams>{
        name: key.algorithm.name,
        saltLength: 256 >> 3,
      }
    case 'RSASSA-PKCS1-v1_5':
      checkRsaKeyAlgorithm(<RsaKeyAlgorithm>key.algorithm)
      return { name: key.algorithm.name }
  }
  throw new UnsupportedOperationError()
}

/**
 * Minimal JWT sign() implementation.
 */
async function jwt(
  header: DPoPJwtHeaderParameters,
  claimsSet: Record<string, unknown>,
  key: CryptoKey,
) {
  if (key.usages.includes('sign') === false) {
    throw new TypeError(
      'private CryptoKey instances used for signing assertions must include "sign" in their "usages"',
    )
  }
  const input = `${b64u(buf(JSON.stringify(header)))}.${b64u(buf(JSON.stringify(claimsSet)))}`
  const signature = b64u(await crypto.subtle.sign(subtleAlgorithm(key), key, buf(input)))
  return `${input}.${signature}`
}

const CHUNK_SIZE = 0x8000
function encodeBase64Url(input: Uint8Array | ArrayBuffer) {
  if (input instanceof ArrayBuffer) {
    input = new Uint8Array(input)
  }

  const arr = []
  for (let i = 0; i < input.byteLength; i += CHUNK_SIZE) {
    // @ts-expect-error
    arr.push(String.fromCharCode.apply(null, input.subarray(i, i + CHUNK_SIZE)))
  }
  return btoa(arr.join('')).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function b64u(input: Uint8Array | ArrayBuffer) {
  return encodeBase64Url(input)
}

/**
 * Generates 32 random bytes and encodes them using base64url.
 */
function randomBytes() {
  return b64u(crypto.getRandomValues(new Uint8Array(32)))
}

/**
 * Supported JWS `alg` Algorithm identifiers.
 *
 * @example PS256 CryptoKey algorithm
 * ```ts
 * interface Ps256Algorithm extends RsaHashedKeyAlgorithm {
 *   name: 'RSA-PSS'
 *   hash: { name: 'SHA-256' }
 * }
 * ```
 *
 * @example ES256 CryptoKey algorithm
 * ```ts
 * interface Es256Algorithm extends EcKeyAlgorithm {
 *   name: 'ECDSA'
 *   namedCurve: 'P-256'
 * }
 * ```
 *
 * @example RS256 CryptoKey algorithm
 * ```ts
 * interface Rs256Algorithm extends RsaHashedKeyAlgorithm {
 *   name: 'RSASSA-PKCS1-v1_5'
 *   hash: { name: 'SHA-256' }
 * }
 * ```
 */
export type JWSAlgorithm = 'PS256' | 'ES256' | 'RS256'

class UnsupportedOperationError extends Error {
  constructor(message?: string) {
    super(message ?? 'operation not supported')
    this.name = this.constructor.name
    // @ts-ignore
    Error.captureStackTrace?.(this, this.constructor)
  }
}

class OperationProcessingError extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
    // @ts-ignore
    Error.captureStackTrace?.(this, this.constructor)
  }
}

/**
 * Determines an RSASSA-PSS algorithm identifier from CryptoKey instance
 * properties.
 */
function psAlg(key: CryptoKey): JWSAlgorithm {
  switch ((<RsaHashedKeyAlgorithm>key.algorithm).hash.name) {
    case 'SHA-256':
      return 'PS256'
    default:
      throw new UnsupportedOperationError('unsupported RsaHashedKeyAlgorithm hash name')
  }
}

/**
 * Determines an RSASSA-PKCS1-v1_5 algorithm identifier from CryptoKey instance
 * properties.
 */
function rsAlg(key: CryptoKey): JWSAlgorithm {
  switch ((<RsaHashedKeyAlgorithm>key.algorithm).hash.name) {
    case 'SHA-256':
      return 'RS256'
    default:
      throw new UnsupportedOperationError('unsupported RsaHashedKeyAlgorithm hash name')
  }
}

/**
 * Determines an ECDSA algorithm identifier from CryptoKey instance properties.
 */
function esAlg(key: CryptoKey): JWSAlgorithm {
  switch ((<EcKeyAlgorithm>key.algorithm).namedCurve) {
    case 'P-256':
      return 'ES256'
    default:
      throw new UnsupportedOperationError('unsupported EcKeyAlgorithm namedCurve')
  }
}

/**
 * Determines a supported JWS `alg` identifier from CryptoKey instance
 * properties.
 */
function determineJWSAlgorithm(key: CryptoKey) {
  switch (key.algorithm.name) {
    case 'RSA-PSS':
      return psAlg(key)
    case 'RSASSA-PKCS1-v1_5':
      return rsAlg(key)
    case 'ECDSA':
      return esAlg(key)
    default:
      throw new UnsupportedOperationError('unsupported CryptoKey algorithm name')
  }
}

function isCryptoKey(key: unknown): key is CryptoKey {
  return key instanceof CryptoKey
}

function isPrivateKey(key: unknown): key is CryptoKey {
  return isCryptoKey(key) && key.type === 'private'
}

function isPublicKey(key: unknown): key is CryptoKey {
  return isCryptoKey(key) && key.type === 'public'
}

/**
 * Returns the current unix timestamp in seconds.
 */
function epochTime() {
  return Math.floor(Date.now() / 1000)
}

export interface KeyPair extends CryptoKeyPair {
  /**
   * Private
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/CryptoKey CryptoKey}
   * instance to sign the DPoP Proof JWT with.
   *
   * Its algorithm must be compatible with a supported
   * {@link JWSAlgorithm JWS `alg` Algorithm}.
   */
  privateKey: CryptoKey

  /**
   * The public key corresponding to {@link DPoPOptions.privateKey}
   */
  publicKey: CryptoKey
}

/**
 * Generates a unique DPoP Proof JWT.
 *
 * @param keypair
 * @param htu The HTTP URI (without query and fragment parts) of the request
 * @param htm The HTTP method of the request
 * @param nonce Server-provided nonce.
 * @param accessToken Associated access token's value.
 * @param additional Any additional claims.
 */
export default async function DPoP(
  keypair: KeyPair,
  htu: string,
  htm: string,
  nonce?: string,
  accessToken?: string,
  additional?: Record<string, JsonValue>,
): Promise<string> {
  const privateKey = keypair?.privateKey
  const publicKey = keypair?.publicKey

  if (!isPrivateKey(privateKey)) {
    throw new TypeError('"keypair.privateKey" must be a private CryptoKey')
  }

  if (!isPublicKey(publicKey)) {
    throw new TypeError('"keypair.publicKey" must be a public CryptoKey')
  }

  if (publicKey.extractable !== true) {
    throw new TypeError('"keypair.publicKey.extractable" must be true')
  }

  if (typeof htu !== 'string') {
    throw new TypeError('"htu" must be a string')
  }

  if (typeof htm !== 'string') {
    throw new TypeError('"htm" must be a string')
  }

  if (nonce !== undefined && typeof nonce !== 'string') {
    throw new TypeError('"nonce" must be a string or undefined')
  }

  if (accessToken !== undefined && typeof accessToken !== 'string') {
    throw new TypeError('"accessToken" must be a string or undefined')
  }

  if (
    additional !== undefined &&
    (typeof additional !== 'object' || typeof additional === null || Array.isArray(additional))
  ) {
    throw new TypeError('"additional" must be an object')
  }

  return jwt(
    {
      alg: determineJWSAlgorithm(privateKey),
      typ: 'dpop+jwt',
      jwk: await publicJwk(publicKey),
    },
    {
      ...additional,
      iat: epochTime(),
      jti: randomBytes(),
      htm,
      nonce,
      htu,
      ath: accessToken ? b64u(await crypto.subtle.digest('SHA-256', buf(accessToken))) : undefined,
    },
    privateKey,
  )
}

/**
 * exports an asymmetric crypto key as bare JWK
 */
async function publicJwk(key: CryptoKey) {
  const { kty, e, n, x, y, crv } = await crypto.subtle.exportKey('jwk', key)
  return { kty, crv, e, n, x, y }
}

export interface GenerateKeyPairOptions {
  /**
   * Indicates whether or not the private key may be exported.
   * Default is `false`.
   */
  extractable?: boolean

  /**
   * (RSA algorithms only) The length, in bits, of the RSA modulus.
   * Default is `2048`.
   */
  modulusLength?: number
}

/**
 * Generates a
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/CryptoKeyPair CryptoKeyPair}
 * for a given JWS `alg` Algorithm identifier.
 *
 * @param alg Supported JWS `alg` Algorithm identifier.
 */
export async function generateKeyPair(
  alg: JWSAlgorithm,
  options?: GenerateKeyPairOptions,
): Promise<CryptoKeyPair> {
  let algorithm: RsaHashedKeyGenParams | EcKeyGenParams

  if (typeof alg !== 'string' || alg.length === 0) {
    throw new TypeError('"alg" must be a non-empty string')
  }

  switch (alg) {
    case 'PS256':
      algorithm = {
        name: 'RSA-PSS',
        hash: 'SHA-256',
        modulusLength: options?.modulusLength ?? 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      }
      break
    case 'RS256':
      algorithm = {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256',
        modulusLength: options?.modulusLength ?? 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      }
      break
    case 'ES256':
      algorithm = { name: 'ECDSA', namedCurve: 'P-256' }
      break
    default:
      throw new UnsupportedOperationError()
  }

  return crypto.subtle.generateKey(algorithm, options?.extractable ?? false, ['sign', 'verify'])
}
