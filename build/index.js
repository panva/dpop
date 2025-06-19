const encoder = new TextEncoder();
const decoder = new TextDecoder();
function buf(input) {
    if (typeof input === 'string') {
        return encoder.encode(input);
    }
    return decoder.decode(input);
}
function checkRsaKeyAlgorithm(algorithm) {
    if (typeof algorithm.modulusLength !== 'number' || algorithm.modulusLength < 2048) {
        throw new OperationProcessingError(`${algorithm.name} modulusLength must be at least 2048 bits`);
    }
}
function subtleAlgorithm(key) {
    switch (key.algorithm.name) {
        case 'ECDSA':
            return { name: key.algorithm.name, hash: 'SHA-256' };
        case 'RSA-PSS':
            checkRsaKeyAlgorithm(key.algorithm);
            return {
                name: key.algorithm.name,
                saltLength: 256 >> 3,
            };
        case 'RSASSA-PKCS1-v1_5':
            checkRsaKeyAlgorithm(key.algorithm);
            return { name: key.algorithm.name };
        case 'Ed25519':
            return { name: key.algorithm.name };
    }
    throw new UnsupportedOperationError();
}
async function jwt(header, claimsSet, key) {
    if (key.usages.includes('sign') === false) {
        throw new TypeError('private CryptoKey instances used for signing assertions must include "sign" in their "usages"');
    }
    const input = `${b64u(buf(JSON.stringify(header)))}.${b64u(buf(JSON.stringify(claimsSet)))}`;
    const signature = b64u(await crypto.subtle.sign(subtleAlgorithm(key), key, buf(input)));
    return `${input}.${signature}`;
}
let encodeBase64Url;
if (Uint8Array.prototype.toBase64) {
    encodeBase64Url = (input) => {
        if (input instanceof ArrayBuffer) {
            input = new Uint8Array(input);
        }
        return input.toBase64({ alphabet: 'base64url', omitPadding: true });
    };
}
else {
    const CHUNK_SIZE = 0x8000;
    encodeBase64Url = (input) => {
        if (input instanceof ArrayBuffer) {
            input = new Uint8Array(input);
        }
        const arr = [];
        for (let i = 0; i < input.byteLength; i += CHUNK_SIZE) {
            arr.push(String.fromCharCode.apply(null, input.subarray(i, i + CHUNK_SIZE)));
        }
        return btoa(arr.join('')).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    };
}
function b64u(input) {
    return encodeBase64Url(input);
}
class UnsupportedOperationError extends Error {
    constructor(message) {
        super(message ?? 'operation not supported');
        this.name = this.constructor.name;
        Error.captureStackTrace?.(this, this.constructor);
    }
}
class OperationProcessingError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace?.(this, this.constructor);
    }
}
function psAlg(key) {
    switch (key.algorithm.hash.name) {
        case 'SHA-256':
            return 'PS256';
        default:
            throw new UnsupportedOperationError('unsupported RsaHashedKeyAlgorithm hash name');
    }
}
function rsAlg(key) {
    switch (key.algorithm.hash.name) {
        case 'SHA-256':
            return 'RS256';
        default:
            throw new UnsupportedOperationError('unsupported RsaHashedKeyAlgorithm hash name');
    }
}
function esAlg(key) {
    switch (key.algorithm.namedCurve) {
        case 'P-256':
            return 'ES256';
        default:
            throw new UnsupportedOperationError('unsupported EcKeyAlgorithm namedCurve');
    }
}
function determineJWSAlgorithm(key) {
    switch (key.algorithm.name) {
        case 'RSA-PSS':
            return psAlg(key);
        case 'RSASSA-PKCS1-v1_5':
            return rsAlg(key);
        case 'ECDSA':
            return esAlg(key);
        case 'Ed25519':
            return 'Ed25519';
        default:
            throw new UnsupportedOperationError('unsupported CryptoKey algorithm name');
    }
}
function isCryptoKey(key) {
    return key instanceof CryptoKey;
}
function isPrivateKey(key) {
    return isCryptoKey(key) && key.type === 'private';
}
function isPublicKey(key) {
    return isCryptoKey(key) && key.type === 'public';
}
function epochTime() {
    return Math.floor(Date.now() / 1000);
}
export async function generateProof(keypair, htu, htm, nonce, accessToken, additional) {
    const privateKey = keypair?.privateKey;
    const publicKey = keypair?.publicKey;
    if (!isPrivateKey(privateKey)) {
        throw new TypeError('"keypair.privateKey" must be a private CryptoKey');
    }
    if (!isPublicKey(publicKey)) {
        throw new TypeError('"keypair.publicKey" must be a public CryptoKey');
    }
    if (publicKey.extractable !== true) {
        throw new TypeError('"keypair.publicKey.extractable" must be true');
    }
    if (typeof htu !== 'string') {
        throw new TypeError('"htu" must be a string');
    }
    if (typeof htm !== 'string') {
        throw new TypeError('"htm" must be a string');
    }
    if (nonce !== undefined && typeof nonce !== 'string') {
        throw new TypeError('"nonce" must be a string or undefined');
    }
    if (accessToken !== undefined && typeof accessToken !== 'string') {
        throw new TypeError('"accessToken" must be a string or undefined');
    }
    if (additional !== undefined &&
        (typeof additional !== 'object' || additional === null || Array.isArray(additional))) {
        throw new TypeError('"additional" must be an object');
    }
    return jwt({
        alg: determineJWSAlgorithm(privateKey),
        typ: 'dpop+jwt',
        jwk: await publicJwk(publicKey),
    }, {
        ...additional,
        iat: epochTime(),
        jti: crypto.randomUUID(),
        htm,
        nonce,
        htu,
        ath: accessToken ? b64u(await crypto.subtle.digest('SHA-256', buf(accessToken))) : undefined,
    }, privateKey);
}
async function publicJwk(key) {
    const { kty, e, n, x, y, crv } = await crypto.subtle.exportKey('jwk', key);
    return { kty, crv, e, n, x, y };
}
export async function generateKeyPair(alg, options) {
    let algorithm;
    if (typeof alg !== 'string' || alg.length === 0) {
        throw new TypeError('"alg" must be a non-empty string');
    }
    switch (alg) {
        case 'PS256':
            algorithm = {
                name: 'RSA-PSS',
                hash: 'SHA-256',
                modulusLength: 2048,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            };
            break;
        case 'RS256':
            algorithm = {
                name: 'RSASSA-PKCS1-v1_5',
                hash: 'SHA-256',
                modulusLength: 2048,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            };
            break;
        case 'ES256':
            algorithm = { name: 'ECDSA', namedCurve: 'P-256' };
            break;
        case 'Ed25519':
            algorithm = { name: 'Ed25519' };
            break;
        default:
            throw new UnsupportedOperationError();
    }
    return (crypto.subtle.generateKey(algorithm, options?.extractable ?? false, ['sign', 'verify']));
}
//# sourceMappingURL=index.js.map