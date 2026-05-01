---
id: usage
title: Usage
sidebar_position: 3
---

# Usage Examples

This section contains practical examples for common cron expression parsing use cases.

## Quick Links

- [Basic Usage](./basic) - Getting started with cron expressions
- [Advanced Features](./advanced) - Timezones, randomization, and strict mode
- [Crontab Files](./crontab) - Parsing crontab files and variables

## Basic Usage

```ts
import { CronExpressionParser } from '@catbee/cron-parser';
const expression = CronExpressionParser.parse('*/5 * * * *');
console.log('Next run:', expression.next());
```
