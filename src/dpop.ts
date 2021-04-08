import JWT from "./jwt";
import jti from "./jti";
import * as base64url from "./base64url";

const iat = () => (Date.now() / 1000) | 0;

async function toJWK(publicKey: CryptoKey) {
  const { kty, x, y, e, n, crv } = await crypto.subtle.exportKey(
    "jwk",
    publicKey
  );
  return { kty, x, y, e, n, crv };
}

export default async (
  keypair: CryptoKeyPair,
  alg: string,
  htu: string,
  htm: string,
  accessToken?: string,
  additional?: object
) => {
  const jwk = await toJWK(keypair.publicKey);

  return JWT(
    keypair.privateKey,
    { typ: "dpop+jwt", alg, jwk },
    {
      ...additional,
      iat: iat(),
      jti: jti(),
      htu,
      htm,
      ath: accessToken
        ? base64url.encode(
            new Uint8Array(
              await crypto.subtle.digest(
                { name: "SHA-256" },
                new TextEncoder().encode(accessToken)
              )
            )
          )
        : undefined,
    }
  );
};
