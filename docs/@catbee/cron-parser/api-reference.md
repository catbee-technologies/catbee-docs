---
id: api-reference
title: API Reference
sidebar_position: 4
---

# API Reference

Complete API documentation for @catbee/cron-parser.

## API Summary

- [**`CronExpressionParser`**](#cronexpressionparser) class:
  - [**`parse(expression: string, options?: CronExpressionOptions): CronExpression`**](#parse) - Parses a cron expression and returns a CronExpression instance.
- [**`CronExpression`**](#cronexpression) class:
  - [**`next(): CronDate`**](#next) - Returns the next occurrence(s) of the cron schedule.
  - [**`prev(): CronDate`**](#prev) - Returns the previous occurrence(s) of the cron schedule.
  - [**`hasNext(): boolean`**](#hasnext) - Checks if there is a next scheduled date based on the current date and cron expression.
  - [**`hasPrev(): boolean`**](#hasprev) - Checks if there is a previous scheduled date based on the current date and cron expression.
  - [**`take(count: number): CronDate[]`**](#take) - Iterate over a specified number of steps and optionally execute a callback function for each step.
  - [**`reset(newDate?: Date | CronDate): void`**](#reset) - Reset the iterators current date to a new date or the initial date.
  - [**`stringify(includeSeconds?: boolean): string`**](#stringify) - Generate a string representation of the cron expression.
  - [**`includesDate(date: Date | CronDate): boolean`**](#includesdate) - Check if the cron expression includes the given date.
  - [**`toString(): string`**](#tostring) - Returns the string date.

- [**`CronFileParser`**](#cronfileparser) class:
  - [**`parseFileSync(filePath: string): CronFileParserResult`**](#parsefilesync) - Synchronously parses a crontab file.
  - [**`parseFile(filePath: string): Promise<CronFileParserResult`**](#parsefile) - Asynchronously parses a crontab file.

---

## Types

### CronExpressionOptions

```ts
interface CronExpressionOptions {
  currentDate?: Date | string | number;
  endDate?: Date | string | number;
  startDate?: Date | string | number;
  tz?: string;
  hashSeed?: string;
  strict?: boolean;
}

```

### CronFileParserResult

```ts
interface CronFileParserResult = {
  variables: { [key: string]: string };
  expressions: CronExpression[];
  errors: { [key: string]: unknown };
};
```

---

## CronExpressionParser

The main parser class for cron expressions.

### `parse()`

Parses a cron expression and returns a CronExpression instance.

**Method Signature:**

```ts
static parse(expression: string, options?: CronExpressionOptions): CronExpression
```

**Parameters:**

- `expression`: The cron expression string to parse
- `options`: Optional parsing options

**Returns:** A CronExpression instance

**Example:**

```ts
import { CronExpressionParser } from '@catbee/cron-parser';
const expression = CronExpressionParser.parse('*/5 * * * *');
console.log(expression.next()); // Get the next occurrence
```

---

## CronExpression

An instance representing a parsed cron expression.

### `next()`

Returns the next occurrence(s) of the cron schedule.

**Method Signature:**

```ts
next(): CronDate
```

**Returns:** The next scheduled date as a CronDate object.

**Example:**

```ts
import { CronExpressionParser } from '@catbee/cron-parser';
const expression = CronExpressionParser.parse('*/5 * * * *');
console.log(expression.next().toString()); // Print the next occurrence
```

---

### `prev()`

Returns the previous occurrence(s) of the cron schedule.

**Method Signature:**

```ts
prev(): CronDate
```

**Returns:** The previous scheduled date as a CronDate object.

**Example:**

```ts
import { CronExpressionParser } from '@catbee/cron-parser';
const expression = CronExpressionParser.parse('*/5 * * * *');
console.log(expression.prev().toString()); // Print the previous occurrence
```

---

### `hasNext()`

Checks if there is a next scheduled date based on the current date and cron expression.

**Method Signature:**

```ts
hasNext(): boolean
```

**Returns:** `true` if there is a next scheduled date, `false` otherwise.

**Example:**

```ts
import { CronExpressionParser } from '@catbee/cron-parser';
const expression = CronExpressionParser.parse('*/5 * * * *');
console.log(expression.hasNext()); // Check if there is a next occurrence
```

---

### `hasPrev()`

Checks if there is a previous scheduled date based on the current date and cron expression.
**Method Signature:**

```ts
hasPrev(): boolean
```

**Returns:** `true` if there is a previous scheduled date, `false` otherwise.

**Example:**

```ts
import { CronExpressionParser } from '@catbee/cron-parser';
const expression = CronExpressionParser.parse('*/5 * * * *');
console.log(expression.hasPrev()); // Check if there is a previous occurrence
```

---

### `take()`

Returns an array of the next N occurrences.

**Method Signature:**

```ts
take(limit: number): CronDate[]
```

**Parameters:**

- `limit`: Number of occurrences to return

**Returns:** Array of CronDate objects representing the next N occurrences.

**Example:**

```ts
import { CronExpressionParser } from '@catbee/cron-parser';
const expression = CronExpressionParser.parse('*/5 * * * *');
console.log(expression.take(3).map(date => date.toString())); // Print the next 3 occurrences
```

---

### `reset()`

Resets the iterator's current date to a new date or the initial date.

**Method Signature:**

```ts
reset(newDate?: Date | CronDate): void
```

**Parameters:**

- `newDate`: Optional new date to reset to. If not provided, resets to the initial date.

**Example:**

```ts
import { CronExpressionParser } from '@catbee/cron-parser';
const expression = CronExpressionParser.parse('*/5 * * * *');
console.log(expression.next().toString()); // Get the next occurrence
expression.reset(); // Reset to the initial date
console.log(expression.next().toString()); // Get the next occurrence again (should be the same as the first one)
```

---

### `stringify()`

Returns the string representation of the cron expression.

**Method Signature:**

```ts
stringify(includeSeconds?: boolean): string
```

**Parameters:**

- `includeSeconds`: Whether to include seconds in the cron expression string (default: `false`)

**Returns:** The cron expression string

**Example:**

```ts
import { CronExpressionParser } from '@catbee/cron-parser';

const expression = CronExpressionParser.parse('*/5 * * * *');
console.log(expression.stringify()); // Output: '*/5 * * * *'
console.log(expression.stringify(true)); // Output: '0 */5 * * * *' (with seconds)
```

---

### `includesDate()`

Checks if a given date matches the cron schedule.

**Method Signature:**

```ts
includesDate(date: Date | CronDate): boolean
```

**Parameters:**

- `date`: The date to check against the cron schedule

**Returns:** `true` if the date matches the cron schedule, `false` otherwise.

**Example:**

```ts
import { CronExpressionParser } from '@catbee/cron-parser';
const expression = CronExpressionParser.parse('*/5 * * * *');
const dateToCheck = new Date('2024-01-01T00:05:00');
console.log(expression.includesDate(dateToCheck)); // Check if the date matches the cron schedule
```

---

### `toString()`

Returns the string representation of the next scheduled date.

**Method Signature:**

```ts
toString(): string
```

**Returns:** The string representation of the next scheduled date.

**Example:**

```ts
import { CronExpressionParser } from '@catbee/cron-parser';
const expression = CronExpressionParser.parse('*/5 * * * *');
console.log(expression.next().toString()); // Print the next occurrence as a string
```

---

## CronFileParser

Parser for crontab files.

### `parseFileSync()`

Synchronously parses a crontab file.

**Method Signature:**

```ts
static parseFileSync(filePath: string): CronFileParserResult
```

**Parameters:**

- `filePath`: Path to the crontab file

**Returns:** `CronFileParserResult`

**Example:**

```ts
import { CronFileParser } from '@catbee/cron-parser';
const result = CronFileParser.parseFileSync('./crontab.txt');
console.log('Variables:', result.variables);
console.log('Expressions:', result.expressions.length);
console.log('Errors:', result.errors);
```

---

### `parseFile()`

Asynchronously parses a crontab file.

**Method Signature:**

```ts
static parseFile(filePath: string): Promise<CronFileParserResult>
```

**Parameters:**

- `filePath`: Path to the crontab file

**Returns:** A promise that resolves to a `CronFileParserResult` object.

**Example:**

```ts
import { CronFileParser } from '@catbee/cron-parser';
const result = await CronFileParser.parseFile('/path/to/crontab');
console.log('Variables:', result.variables);
console.log('Expressions:', result.expressions.length);
console.log('Errors:', result.errors);
```

---
