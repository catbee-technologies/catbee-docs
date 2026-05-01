---
id: intro
title: Introduction
sidebar_position: 1
---

# Introduction

## ⏱️ @catbee/cron-parser – Cron expression parser for Node.js and TypeScript

A lightweight, timezone-aware cron expression parser with full support for seconds, DST transitions, iterators, randomized scheduling, and crontab file parsing. Built for production systems with clean TypeScript types and zero-config ESM/CJS support.

<div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', margin: '1rem 0', }}>
  <img src="https://github.com/catbee-technologies/cron-parser/actions/workflows/ci.yml/badge.svg" alt="Build Status" />
  <img src="https://codecov.io/gh/catbee-technologies/cron-parser/graph/badge.svg" alt="Coverage" />
  <img src="https://img.shields.io/node/v/@catbee/cron-parser" alt="Node Version" />
  <img src="https://img.shields.io/npm/v/@catbee/cron-parser" alt="NPM Version" />
  <img src="https://img.shields.io/npm/dt/@catbee/cron-parser" alt="NPM Downloads" />
  <img src="https://img.shields.io/npm/types/@catbee/cron-parser" alt="TypeScript Types" />
  <img src="https://img.shields.io/npm/l/@catbee/cron-parser" alt="License" />
</div>

---

## 📦 Installation

```bash
npm install @catbee/cron-parser
```

---

## Cron Format

```
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └─ day of week (0-7, 1L-7L) (0 or 7 is Sun)
│    │    │    │    └────── month (1-12, JAN-DEC)
│    │    │    └─────────── day of month (1-31, L)
│    │    └──────────────── hour (0-23)
│    └───────────────────── minute (0-59)
└────────────────────────── second (0-59, optional)
```

---

## Special Characters

| Character | Description               | Example                                       |
| --------- | ------------------------- | --------------------------------------------- |
| `*`       | Any value                 | `* * * * *` (every minute)                    |
| `?`       | Any value (alias for `*`) | `? * * * *` (every minute)                    |
| `,`       | Value list separator      | `1,2,3 * * * *` (1st, 2nd, and 3rd minute)    |
| `-`       | Range of values           | `1-5 * * * *` (every minute from 1 through 5) |
| `/`       | Step values               | `*/5 * * * *` (every 5th minute)              |
| `L`       | Last day of month/week    | `0 0 L * *` (midnight on last day of month)   |
| `#`       | Nth day of month          | `0 0 * * 1#1` (first Monday of month)         |
| `H`       | Randomized value          | `H * * * *` (random minute every hour)        |

---

## Predefined Expressions

| Expression  | Description                               | Equivalent      |
| ----------- | ----------------------------------------- | --------------- |
| `@yearly`   | Once a year at midnight of January 1      | `0 0 0 1 1 *`   |
| `@monthly`  | Once a month at midnight of first day     | `0 0 0 1 * *`   |
| `@weekly`   | Once a week at midnight on Sunday         | `0 0 0 * * 0`   |
| `@daily`    | Once a day at midnight                    | `0 0 0 * * *`   |
| `@hourly`   | Once an hour at the beginning of the hour | `0 0 * * * *`   |
| `@minutely` | Once a minute                             | `0 * * * * *`   |
| `@secondly` | Once a second                             | `* * * * * *`   |
| `@weekdays` | Every weekday at midnight                 | `0 0 0 * * 1-5` |
| `@weekends` | Every weekend at midnight                 | `0 0 0 * * 0,6` |

---

## Field Values

| Field        | Values | Special Characters              | Aliases                        |
| ------------ | ------ | ------------------------------- | ------------------------------ |
| second       | 0-59   | `*` `?` `,` `-` `/` `H`         |                                |
| minute       | 0-59   | `*` `?` `,` `-` `/` `H`         |                                |
| hour         | 0-23   | `*` `?` `,` `-` `/` `H`         |                                |
| day of month | 1-31   | `*` `?` `,` `-` `/` `H` `L`     |                                |
| month        | 1-12   | `*` `?` `,` `-` `/` `H`         | `JAN`-`DEC`                    |
| day of week  | 0-7    | `*` `?` `,` `-` `/` `H` `L` `#` | `SUN`-`SAT` (0 or 7 is Sunday) |

---

## Options

| Option      | Type                     | Description                                                                                                               |
| ----------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| currentDate | Date \| string \| number | Current date. Defaults to current local time in UTC. If not provided but `startDate` is set, `startDate` is used instead. |
| endDate     | Date \| string \| number | End date of iteration range. Sets the iteration range end point                                                           |
| startDate   | Date \| string \| number | Start date of iteration range. Sets the iteration range start point                                                       |
| tz          | string                   | Timezone (e.g. `Europe/London`)                                                                                           |
| hashSeed    | string                   | Seed used for `H` randomized field values                                                                                 |
| strict      | boolean                  | Enable strict validation for expression format and day-of-month/day-of-week rules                                         |

Supported string date formats:

- ISO8601
- HTTP and RFC2822
- SQL
