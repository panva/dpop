# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.1.0](https://github.com/panva/dpop/compare/v2.0.0...v2.1.0) (2025-06-19)


### Features

* support for calculating dpop_jkt ([64ef4ce](https://github.com/panva/dpop/commit/64ef4ce01528a511ffb92fd48195f894d2488184))

## [2.0.0](https://github.com/panva/dpop/compare/v1.4.1...v2.0.0) (2025-06-19)


### ⚠ BREAKING CHANGES

* use named exports, update docs, update dev deps and workflows
* remove the modulusLength generate key option
* remove the EdDSA deprecated algorithm support

### Features

* add support for the fully-specified Ed25519 JWS Algorithm ([ca266d9](https://github.com/panva/dpop/commit/ca266d9be0ba819b6ec9bbd39c4bb16a1cd64a8f))


### Refactor

* remove the EdDSA deprecated algorithm support ([cc050dc](https://github.com/panva/dpop/commit/cc050dc912b0bd5ea3aae6d4ca979eb58bd2dabb))
* remove the modulusLength generate key option ([6c6c6e4](https://github.com/panva/dpop/commit/6c6c6e48f3d02f15b7bd2cf6cee2353fd722d764))
* use named exports, update docs, update dev deps and workflows ([3502f38](https://github.com/panva/dpop/commit/3502f38ff56e4060a16e9f9f5212d5bf2f02174b))

## [1.4.1](https://github.com/panva/dpop/compare/v1.4.0...v1.4.1) (2024-05-27)


### Fixes

* `additional` may not be null ([#10](https://github.com/panva/dpop/issues/10)) ([be6b00b](https://github.com/panva/dpop/commit/be6b00bba8bcbbf53445eb92aa459fd96387d9b7))

## [1.4.0](https://github.com/panva/dpop/compare/v1.2.0...v1.4.0) (2023-09-08)


### Features

* DPoP is now RFC9449 ([62289ce](https://github.com/panva/dpop/commit/62289ceece9e7e8d4bff42a325be8b6aa797907c))

## [1.3.0](https://github.com/panva/dpop/compare/v1.2.0...v1.3.0) (2023-09-08)


### Features

* DPoP is now RFC9449 ([2c3c500](https://github.com/panva/dpop/commit/2c3c5008bf0a27da4d6c8b599e90160e64efead3))

## [1.2.0](https://github.com/panva/dpop/compare/v1.1.0...v1.2.0) (2023-04-26)


### Features

* release process with provenance ([1053717](https://github.com/panva/dpop/commit/10537177ffc4a1411a2d1d1df94f119d60323ed8))

## [1.1.0](https://github.com/panva/dpop/compare/v1.0.0...v1.1.0) (2022-09-28)


### Features

* add EdDSA (Ed25519) JWS support ([dd52a63](https://github.com/panva/dpop/commit/dd52a63d59b157587ce2dcdc3465f4d04c20b958))

## [1.0.0](https://github.com/panva/dpop/compare/v0.7.0...v1.0.0) (2022-05-19)

## 0.7.0 (2022-05-18)


### ⚠ BREAKING CHANGES

* updated API, updated draft to -08

### Refactor

* updated API, updated draft to -08 ([10dd522](https://github.com/panva/dpop/commit/10dd522f4e00fa09a91524d2d9dfb0fd1fad16f3))

## [0.6.0](https://github.com/panva/dpop/compare/v0.5.5...v0.6.0) (2021-04-08)


### ⚠ BREAKING CHANGES

* function signature changed to
function DPoP(keypair: [CryptoKeyPair](https://developer.mozilla.org/en-US/docs/Web/API/CryptoKeyPair), alg: string, htu: string, htm: string, accessToken?: string, additional?: object) => Promise<string>;
to accommodate for the optional resource access `ath` (hash of the access token) claim.

### Features

* update to draft-03 ([78680b5](https://github.com/panva/dpop/commit/78680b5bc33cf5341b81b27fc98be52a7b74480c))

## [0.5.5](https://github.com/panva/dpop/compare/v0.5.4...v0.5.5) (2020-04-02)



## [0.5.4](https://github.com/panva/dpop/compare/v0.5.3...v0.5.4) (2020-04-02)



## [0.5.3](https://github.com/panva/dpop/compare/v0.5.2...v0.5.3) (2020-03-31)



## [0.5.2](https://github.com/panva/dpop/compare/v0.5.1...v0.5.2) (2020-03-31)



## [0.5.1](https://github.com/panva/dpop/compare/v0.5.0...v0.5.1) (2020-03-31)


### Bug Fixes

* remove unused code ([478d44d](https://github.com/panva/dpop/commit/478d44d43ca5d53c3c0d30929345718638ab11f4))



# [0.5.0](https://github.com/panva/dpop/compare/v0.4.0...v0.5.0) (2020-03-31)


### Build System

* move to ts, src, web distro bundles ([85a744c](https://github.com/panva/dpop/commit/85a744c8c118705034ce182f9d618eb87e4e60cd))


### BREAKING CHANGES

* module entrypoints re-defined



# 0.4.0 (2020-03-10)


### Features

* DPoP for the browser - ESM module implementation (individual draft 04) ([df163bd](https://github.com/panva/dpop/commit/df163bd0fc0bd4c09f065c2d687f6b78d44f100e))
