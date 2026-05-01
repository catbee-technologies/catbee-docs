---
id: crontab
title: Crontab Files
sidebar_position: 3
---

# Crontab File Operations

Learn how to parse crontab files and work with environment variables.

## Parsing Crontab Files

```ts
import { CronFileParser } from '@catbee/cron-parser';

const result = CronFileParser.parseFileSync('./crontab.txt');
console.log('Variables:', result.variables);
console.log('Expressions:', result.expressions.length);
console.log('Errors:', result.errors);
```

## Asynchronous Parsing

```ts
import { CronFileParser } from '@catbee/cron-parser';

const result = await CronFileParser.parseFile('/path/to/crontab');
console.log('Variables:', result.variables);
console.log('Expressions:', result.expressions.length);
console.log('Errors:', result.errors);
```
