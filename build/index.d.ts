export type JsonObject = {
    [Key in string]?: JsonValue;
};
export type JsonArray = JsonValue[];
export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
/**
 * @ignore
 */
export type CryptoKey = Extract<Awaited<ReturnType<typeof crypto.subtle.generateKey>>, {
    type: string;
}>;
/**
 * Supported JWS `alg` Algorithm identifiers.
 *
 * @example CryptoKey algorithm for the ES256 JWS Algorithm Identifier
 *
 * ```ts
 * interface ES256Algorithm extends EcKeyAlgorithm {
 *   name: 'ECDSA'
 *   namedCurve: 'P-256'
 * }
 * ```
 *
 * @example CryptoKey algorithm for the Ed25519 JWS Algorithm Identifier
 *
 * ```ts
 * interface Ed25519Algorithm extends Algorithm {
 *   name: 'Ed25519'
 * }
 * ```
 *
 * @example CryptoKey algorithm for the PS256 JWS Algorithm Identifier
 *
 * ```ts
 * interface PS256Algorithm extends RsaHashedKeyAlgorithm {
 *   name: 'RSA-PSS'
 *   hash: { name: 'SHA-256' }
 * }
 * ```
 *
 * @example CryptoKey algorithm for the RS256 JWS Algorithm Identifier
 *
 * ```ts
 * interface RS56Algorithm extends RsaHashedKeyAlgorithm {
 *   name: 'RSASSA-PKCS1-v1_5'
 *   hash: { name: 'SHA-256' }
 * }
 * ```
 */
export type JWSAlgorithm = 'ES256' | 'Ed25519' | 'RS256' | 'PS256';
/**
 * @ignore
 */
export interface CryptoKeyPair {
    privateKey: CryptoKey;
    publicKey: CryptoKey;
}
export interface KeyPair extends CryptoKeyPair {
    /**
     * Private CryptoKey instance to sign the DPoP Proof JWT with.
     *
     * Its algorithm must be compatible with a supported {@link JWSAlgorithm JWS `alg` Algorithm}.
     */
    privateKey: CryptoKey;
    /**
     * The public CryptoKey instance corresponding to {@link KeyPair.privateKey}
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
 * @param accessToken Access token's value (When making protected resource requests).
 * @param additional Any additional claims.
 */
export declare function generateProof(keypair: KeyPair, htu: string, htm: string, nonce?: string, accessToken?: string, additional?: Record<string, JsonValue>): Promise<string>;
export interface GenerateKeyPairOptions {
    /**
     * Indicates whether or not the private key may be exported. Default is `false`.
     */
    extractable?: boolean;
}
/**
 * Generates a {@link KeyPair} for a given JWS `alg` Algorithm identifier.
 *
 * @param alg Supported JWS `alg` Algorithm identifier.
 */
export declare function generateKeyPair(alg: JWSAlgorithm, options?: GenerateKeyPairOptions): Promise<KeyPair>;
/**
 * Calculates the JWK Thumbprint of the DPoP public key using the SHA-256 hash function for use as
 * the optional `dpop_jkt` authorization request parameter.
 */
export declare function calculateThumbprint(publicKey: CryptoKey): Promise<string>;
