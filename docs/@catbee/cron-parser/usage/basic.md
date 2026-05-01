---
id: basic
title: Basic
sidebar_position: 1
---

# Basic Usage

Get started with @catbee/cron-parser by learning the basic API.

## ⚡ Quick Start

```ts
import { CronExpressionParser, CronExpressionOptions } from '@catbee/cron-parser';

const options: CronExpressionOptions = {
  currentDate: '2023-01-01T00:00:00Z',
  tz: 'UTC',
  strict: false
};

const expression = CronExpressionParser.parse('*/5 * * * *', options);
console.log('Next:', expression.next().toString());

const nextThree = expression.take(3);
console.log('Next 3:', nextThree.map(date => date.toString()));

const includesNow = expression.includesDate(new Date());
console.log('Includes now?', includesNow);
```

## Parsing Expressions

```ts
import { CronExpressionParser } from '@catbee/cron-parser';

// Parse a simple expression
const everyMinute = CronExpressionParser.parse('* * * * *');

// Parse with options
const withOptions = CronExpressionParser.parse('0 0 * * *', {
  tz: 'America/New_York',
  currentDate: '2023-01-01T00:00:00Z'
});
```

## Iterating Schedules

```ts
import { CronExpressionParser } from '@catbee/cron-parser';

const expression = CronExpressionParser.parse('0 */2 * * *'); // Every 2 hours

// Get next occurrence
const next = expression.next();
console.log('Next execution:', next.toISOString());

// Get next 5 occurrences
const nextFive = expression.take(5);
nextFive.forEach((date, index) => {
  console.log(`Execution ${index + 1}:`, date.toISOString());
});

// Get previous occurrence
const previous = expression.prev();
console.log('Previous execution:', previous.toISOString());
```

## Checking Dates

```ts
import { CronExpressionParser } from '@catbee/cron-parser';

const monday = new Date('2023-01-09T09:00:00Z'); // Monday
const tuesday = new Date('2023-01-10T09:00:00Z'); // Tuesday

const expression = CronExpressionParser.parse('0 9 * * 1', {
  startDate: new Date('2023-01-01T00:00:00Z'),
  endDate: new Date('2023-12-31T23:59:59Z'),
  tz: 'UTC'
}); // Every Monday at 9 AM

console.log('Monday matches:', expression.includesDate(monday)); // true
console.log('Tuesday matches:', expression.includesDate(tuesday)); // false
```

## Predefined Expressions

```ts
import { CronExpressionParser } from '@catbee/cron-parser';

// Use predefined expressions
const daily = CronExpressionParser.parse('@daily');
const weekly = CronExpressionParser.parse('@weekly');
const hourly = CronExpressionParser.parse('@hourly');

console.log('Daily next:', daily.next().toISOString());
console.log('Weekly next:', weekly.next().toISOString());
console.log('Hourly next:', hourly.next().toISOString());
```
