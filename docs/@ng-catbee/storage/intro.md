---
id: intro
title: Introduction
sidebar_position: 1
---

## @ng-catbee/storage – Angular Web Storage Wrapper

> A modern, type-safe Angular library for simplified interaction with web storage APIs (localStorage and sessionStorage) — fully compatible with Server-Side Rendering (SSR) and offering advanced features like JSON storage, boolean/number parsing, enum validation, reactive observables, and configurable encoding strategies.

<div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', margin: '1rem 0', }}>
  <img src="https://github.com/catbee-technologies/ng-catbee/actions/workflows/ci.yml/badge.svg?label=Build" alt="Build Status" />
  <img src="https://github.com/catbee-technologies/ng-catbee/actions/workflows/github-code-scanning/codeql/badge.svg" alt="CodeQL" />
  <img src="https://codecov.io/github/catbee-technologies/ng-catbee/graph/badge.svg?token=1A3ZOKH80Q" alt="Coverage" />
  <img src="https://img.shields.io/npm/v/@ng-catbee/storage" alt="NPM Version" />
  <img src="https://img.shields.io/npm/dt/@ng-catbee/storage" alt="NPM Downloads" />
  <img src="https://img.shields.io/maintenance/yes/2050" alt="Maintenance" />
  <img src="https://sonarcloud.io/api/project_badges/measure?project=catbee-technologies_ng-catbee&metric=alert_status&token=c4ee05a3fd22735559b3313d201e64d85df79d18" alt="Quality Gate Status" />
  <img src="https://sonarcloud.io/api/project_badges/measure?project=catbee-technologies_ng-catbee&metric=security_rating&token=c4ee05a3fd22735559b3313d201e64d85df79d18" alt="Security Rating" />
  <img src="https://sonarcloud.io/api/project_badges/measure?project=catbee-technologies_ng-catbee&metric=sqale_rating&token=c4ee05a3fd22735559b3313d201e64d85df79d18" alt="Maintainability Rating" />
  <img src="https://img.shields.io/npm/l/@ng-catbee/storage" alt="License" />
</div>

## 📦 Demo

[Stackblitz](https://stackblitz.com/edit/ng-catbee-storage?file=src%2Fapp%2Fapp.component.ts)

## ✨ Features

- 🔒 **Type-Safe** - Full TypeScript support with generics
- 📦 **Dual Storage** - Separate services for localStorage and sessionStorage
- 🎯 **Advanced Getters** - Built-in support for JSON, arrays, booleans, numbers, and enums
- 🔄 **Reactive** - Observable-based change detection with RxJS
- 🌐 **SSR Compatible** - Gracefully handles server-side rendering
- 🎨 **Configurable Encoding** - Base64, custom, or no encoding
- ⚡ **Bulk Operations** - Get/set multiple items at once
- 📦 **Zero Dependencies** - Lightweight with no external dependencies

## 🧩 Angular Compatibility

| Angular Version | Supported          |
| --------------- | ------------------ |
| `v17` and above | ✅ Fully supported |

This library is built and tested with Angular **20.x**, and supports all modern standalone-based Angular projects (v17+).

## 📜 License

MIT © Catbee Technologies (see the [LICENSE](/license/) file for the full text)
