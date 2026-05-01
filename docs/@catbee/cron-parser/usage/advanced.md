---
id: advanced
title: Advanced
sidebar_position: 2
---

# Advanced Features

Explore advanced features like timezones, randomization, and strict mode.

## Timezone Support

The parser handles timezone-aware scheduling and DST transitions with Luxon.

```ts
import { CronExpressionParser } from '@catbee/cron-parser';

const interval = CronExpressionParser.parse('0 * * * *', {
  currentDate: '2026-03-29T01:30:00',
  tz: 'Europe/Rome'
});

console.log(interval.next().toISOString()); // 2026-03-29T01:00:00Z - 03:00 CEST
console.log(interval.next().toISOString()); // 2026-03-29T02:00:00Z - 04:00 CEST
```

> Note: The above example demonstrates the spring forward DST transition. The repeated hour during the fall back transition is also handled correctly.

```ts
import { CronExpressionParser } from '@catbee/cron-parser';

const interval = CronExpressionParser.parse('0 * * * *', {
  currentDate: '2026-10-25T01:30:00',
  tz: 'Europe/Rome'
});

console.log(interval.next().toISOString()); // 2026-10-25T00:00:00Z - 02:00 CEST
console.log(interval.next().toISOString()); // 2026-10-25T01:00:00Z - 02:00 CET (repeated hour)
console.log(interval.next().toISOString()); // 2026-10-25T02:00:00Z - 03:00 CET

```

> Note: During the fall back DST transition, the hour from 01:00 to 02:00 occurs twice. The parser correctly handles this by returning both occurrences in the correct order.

## Randomized Scheduling (`H`)

The `H` character produces deterministic jitter when used with the same `hashSeed`.

```ts
import { CronExpressionParser } from '@catbee/cron-parser';

const interval = CronExpressionParser.parse('H * * * *', {
  currentDate: '2023-03-26T01:00:00Z',
  hashSeed: 'job-name'
});

console.log(interval.stringify()); // 6 * * * *
```

## Strict Mode

Strict mode enforces more explicit cron expressions by rejecting ambiguous forms.

- Prevents both `dayOfMonth` and `dayOfWeek` from being used together in strict mode
- Requires the full 6-field expression if strict mode is enabled
- Rejects empty expressions

```ts
import { CronExpressionParser } from '@catbee/cron-parser';

try {
  CronExpressionParser.parse('0 0 12 1-31 * 1', { strict: true });
} catch (err) {
  console.error(err.message); // Cannot use both dayOfMonth and dayOfWeek together in strict mode!
}
```

## Last Day of Month / Week Support

The parser supports `L` in day-of-month and day-of-week fields to represent the last occurrence.

```ts
import { CronExpressionParser } from '@catbee/cron-parser';

const lastMonday = CronExpressionParser.parse('0 0 0 * * 1L');
const lastDayOfMonth = CronExpressionParser.parse('0 0 L * *');

console.log('Last Monday of month:', lastMonday.next().toISOString());
console.log('Last day of month:', lastDayOfMonth.next().toISOString());
```

## Date Ranges

Set iteration ranges with `startDate` and `endDate` options.

```ts
import { CronExpressionParser } from '@catbee/cron-parser';

const expression = CronExpressionParser.parse('* * * * *', {
  startDate: '2023-01-01T00:00:00Z',
  endDate: '2023-01-02T00:00:00Z',
  currentDate: '2023-01-01T12:00:00Z'
});

// Will only return dates within the range
const occurrences = expression.take(10);
console.log(occurrences.map(date => date.toISOString())); // Returns occurrences from 2023-01-01T12:01:00Z to 2023-01-01T12:10:00Z
```

## Complex Expressions

```ts
import { CronExpressionParser } from '@catbee/cron-parser';

// Every weekday at 9 AM
const weekdays = CronExpressionParser.parse('0 9 * * 1-5');

// First Monday of every month
const firstMonday = CronExpressionParser.parse('0 0 * * 1#1');

// Every 15 minutes during business hours
const businessHours = CronExpressionParser.parse('*/15 9-17 * * 1-5');

// Last day of every quarter
const quarterly = CronExpressionParser.parse('0 0 L */3 *');
```

## Iteration with Timezones

```ts
import { CronExpressionParser } from '@catbee/cron-parser';

const expression = CronExpressionParser.parse('0 0 * * *', {
  tz: 'America/New_York',
  currentDate: '2023-03-12T00:00:00Z' // UTC time
});

// All iterations will be in New York timezone
const nextExecutions = expression.take(3);
nextExecutions.forEach(exec => {
  console.log(exec.toString()); // In America/New_York timezone
});
```
