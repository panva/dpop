export declare type JsonObject = {
    [Key in string]?: JsonValue;
};
export declare type JsonArray = JsonValue[];
export declare type JsonPrimitive = string | number | boolean | null;
export declare type JsonValue = JsonPrimitive | JsonObject | JsonArray;
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
 * @example CryptoKey algorithm for the `ES256` JWS Algorithm Identifier
 * ```ts
 * interface Es256Algorithm extends EcKeyAlgorithm {
 *   name: 'ECDSA'
 *   namedCurve: 'P-256'
 * }
 * ```
 *
 * @example CryptoKey algorithm for the `RS256` JWS Algorithm Identifier
 * ```ts
 * interface Rs256Algorithm extends RsaHashedKeyAlgorithm {
 *   name: 'RSASSA-PKCS1-v1_5'
 *   hash: { name: 'SHA-256' }
 * }
 * ```
 *
 * @example CryptoKey algorithm for the `EdDSA` JWS Algorithm Identifier (Experimental)
 *
 * Runtime support for this algorithm is very limited, it depends on the [Secure Curves in the Web
 * Cryptography API](https://wicg.github.io/webcrypto-secure-curves/) proposal which is yet to be
 * widely adopted. If the proposal changes this implementation will follow up with a minor release.
 *
 * ```ts
 * interface EdDSAAlgorithm extends KeyAlgorithm {
 *   name: 'Ed25519'
 * }
 * ```
 */
export declare type JWSAlgorithm = 'PS256' | 'ES256' | 'RS256' | 'EdDSA';
export interface KeyPair extends CryptoKeyPair {
    /**
     * Private
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/CryptoKey CryptoKey}
     * instance to sign the DPoP Proof JWT with.
     *
     * Its algorithm must be compatible with a supported
     * {@link JWSAlgorithm JWS `alg` Algorithm}.
     */
    privateKey: CryptoKey;
    /**
     * The public key corresponding to {@link DPoPOptions.privateKey}
     */
    publicKey: CryptoKey;
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
export default function DPoP(keypair: KeyPair, htu: string, htm: string, nonce?: string, accessToken?: string, additional?: Record<string, JsonValue>): Promise<string>;
export interface GenerateKeyPairOptions {
    /**
     * Indicates whether or not the private key may be exported.
     * Default is `false`.
     */
    extractable?: boolean;
    /**
     * (RSA algorithms only) The length, in bits, of the RSA modulus.
     * Default is `2048`.
     */
    modulusLength?: number;
}
/**
 * Generates a
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/CryptoKeyPair CryptoKeyPair}
 * for a given JWS `alg` Algorithm identifier.
 *
 * @param alg Supported JWS `alg` Algorithm identifier.
 */
export declare function generateKeyPair(alg: JWSAlgorithm, options?: GenerateKeyPairOptions): Promise<CryptoKeyPair>;
