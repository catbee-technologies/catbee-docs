---
id: intro
title: Introduction
sidebar_position: 1
---

## @ng-catbee/jwt – Angular JWT Decoder & Manager

> A modern, type-safe Angular library for decoding, validating, and managing JSON Web Tokens (JWT) in client-side applications — fully compatible with Server-Side Rendering (SSR) and offering comprehensive token utilities including expiration tracking, claim extraction, and reactive observables.

<div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', margin: '1rem 0', }}>
  <img src="https://github.com/catbee-technologies/ng-catbee/actions/workflows/ci.yml/badge.svg?label=Build" alt="Build Status" />
  <img src="https://github.com/catbee-technologies/ng-catbee/actions/workflows/github-code-scanning/codeql/badge.svg" alt="CodeQL" />
  <img src="https://codecov.io/github/catbee-technologies/ng-catbee/graph/badge.svg?token=1A3ZOKH80Q" alt="Coverage" />
  <img src="https://img.shields.io/npm/v/@ng-catbee/jwt" alt="NPM Version" />
  <img src="https://img.shields.io/npm/dt/@ng-catbee/jwt" alt="NPM Downloads" />
  <img src="https://img.shields.io/maintenance/yes/2050" alt="Maintenance" />
  <img src="https://sonarcloud.io/api/project_badges/measure?project=catbee-technologies_ng-catbee&metric=alert_status&token=c4ee05a3fd22735559b3313d201e64d85df79d18" alt="Quality Gate Status" />
  <img src="https://sonarcloud.io/api/project_badges/measure?project=catbee-technologies_ng-catbee&metric=security_rating&token=c4ee05a3fd22735559b3313d201e64d85df79d18" alt="Security Rating" />
  <img src="https://sonarcloud.io/api/project_badges/measure?project=catbee-technologies_ng-catbee&metric=sqale_rating&token=c4ee05a3fd22735559b3313d201e64d85df79d18" alt="Maintainability Rating" />
  <img src="https://img.shields.io/npm/l/@ng-catbee/jwt" alt="License" />
</div>

## 📦 Demo

[Stackblitz](https://stackblitz.com/edit/ng-catbee-jwt?file=src%2Fapp%2Fapp.component.ts)

## ✨ Features

- 🔓 **Token Decoding** - Decode JWT headers and payloads with TypeScript support
- ⏰ **Expiration Management** - Check expiration, get remaining time, watch in real-time
- 🎯 **Type-Safe Claims** - Extract specific claims with generic type support
- ✅ **Format Validation** - Validate JWT format before decoding
- 🔄 **Reactive Observables** - Watch token expiration with RxJS
- 🌐 **SSR Compatible** - Works seamlessly with server-side rendering
- 🚀 **Zero Dependencies** - Lightweight (except Angular and RxJS)

## ⚠️ Security Notice

:::warning
**This library decodes JWTs but does NOT verify signatures.** Always verify JWT signatures on your backend server. Client-side decoding should only be used for reading non-sensitive metadata and UI logic.
:::

## 🧩 Angular Compatibility

| Angular Version | Supported          |
| --------------- | ------------------ |
| `v17` and above | ✅ Fully supported |

This library is built and tested with Angular **20.x**, and supports all modern standalone-based Angular projects (v17+).

## 📜 License

MIT © Catbee Technologies (see the [LICENSE](/license/) file for the full text)
