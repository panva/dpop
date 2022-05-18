# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
