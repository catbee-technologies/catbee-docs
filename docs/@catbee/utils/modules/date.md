---
slug: ../date
---

# Date

A set of utilities for parsing, formatting, and manipulating dates in Node.js and TypeScript.  
These methods provide type-safe helpers for common date operations such as formatting, parsing, arithmetic, and comparison.

## API Summary

### Classes and Constants

- [**`DateBuilder`**](#datebuilder) - Fluent date builder class for chainable date operations.
- [**`DateConstants`**](#dateconstants) - Constants for time conversions.

### Functions

- [**`formatDate(date: Date | number, options?: DateFormatOptions): string`**](#formatdate) - Formats a date according to a pattern, locale, and time zone.
- [**`formatRelativeTime(date: Date | number, now?: Date | number, locale?: string | string[]): string`**](#formatrelativetime) - Formats a date as relative time (e.g., "5 minutes ago", "in 3 days").
- [**`parseDate(input: string | number, fallback?: Date): Date | null`**](#parsedate) - Parses a date string or timestamp into a Date object.
- [**`dateDiff(date1: Date | number, date2?: Date | number, unit?: 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days' | 'months' | 'years'): number`**](#datediff) - Calculates the difference between two dates in the specified unit.
- [**`addToDate(date: Date | number, amount: number, unit: 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days' | 'months' | 'years'): Date`**](#addtodate) - Adds a specified amount of time to a date.
- [**`startOf(date: Date | number, unit: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year'): Date`**](#startof) - Gets the start of a date unit.
- [**`endOf(date: Date | number, unit: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year'): Date`**](#endof) - Gets the end of a date unit.
- [**`isBetween(date: Date | number, start: Date | number, end: Date | number, inclusive?: boolean): boolean`**](#isbetween) - Checks if a date is between two other dates.
- [**`isLeapYear(year: number | Date): boolean`**](#isleapyear) - Checks if a year is a leap year.
- [**`daysInMonth(year: number | Date, month?: number): number`**](#daysinmonth) - Gets the number of days in a month.
- [**`formatDuration(ms: number): string`**](#formatduration) - Formats a duration in milliseconds to a human-readable string.
- [**`parseDuration(value: string | number): number`**](#parseduration) - Parses a duration string or number into milliseconds.
- [**`getDateFromDuration(input: string): Date`**](#getdatefromduration) - Converts a duration string into a Date object representing the future time.
- [**`isWeekend(date: Date | number): boolean`**](#isweekend) - Checks if a date is on a weekend.
- [**`isToday(date: Date | number): boolean`**](#istoday) - Checks if a date is today.
- [**`isFuture(date: Date | number): boolean`**](#isfuture) - Checks if a date is in the future.
- [**`isPast(date: Date | number): boolean`**](#ispast) - Checks if a date is in the past.
- [**`addDays(date: Date | number, days: number): Date`**](#adddays) - Adds days to a date.
- [**`addMonths(date: Date | number, months: number): Date`**](#addmonths) - Adds months to a date.
- [**`addYears(date: Date | number, years: number): Date`**](#addyears) - Adds years to a date.
- [**`quarterOf(date: Date | number): 1 | 2 | 3 | 4`**](#quarterof) - Gets the quarter of the year for a date.
- [**`weekOfYear(date: Date | number): number`**](#weekofyear) - Gets the ISO week number of the year.

---

## Interfaces & Types

```ts
export interface DateFormatOptions {
  format?: string;
  locale?: string | string[];
  timeZone?: string;
}
```

---

## Example Usage

```ts
import {
  formatDate,
  formatRelativeTime,
  parseDate,
  dateDiff,
  addToDate,
  startOf,
  endOf,
  isBetween,
  isLeapYear,
  daysInMonth,
  DateFormatOptions
} from '@catbee/utils/date';

// Format today's date
console.log(formatDate(new Date(), { format: 'yyyy-MM-dd' }));

// Get relative time
console.log(formatRelativeTime(Date.now() - 1000 * 60 * 60)); // "1 hour ago"

// Parse a date string
const d = parseDate('2023-05-15');

// Add 7 days
const nextWeek = addToDate(d!, 7, 'days');

// Get start and end of month
const startMonth = startOf(d!, 'month');
const endMonth = endOf(d!, 'month');

// Check leap year
console.log(isLeapYear(2024)); // true

// Days in month
console.log(daysInMonth(2023, 1)); // 28
```

---

## Function Documentation & Usage Examples

---

### `DateBuilder`

Fluent date builder class for chainable date manipulation and building. All methods return a new instance, making it immutable.

**Class Overview:**

```ts
class DateBuilder {
  constructor(date?: Date | number | string);
  static from(date: Date | number | string): DateBuilder;
  static now(): DateBuilder;
  static of(year: number, month: number, day: number, hour?: number, minute?: number, second?: number, millisecond?: number): DateBuilder;
  static parse(dateString: string): DateBuilder;
  static fromDuration(duration: string): DateBuilder;

  // Setters
  year(year: number): DateBuilder;
  month(month: number): DateBuilder; // 1-12, not 0-11
  day(day: number): DateBuilder;
  hour(hour: number): DateBuilder;
  minute(minute: number): DateBuilder;
  second(second: number): DateBuilder;
  millisecond(millisecond: number): DateBuilder;

  // Addition/Subtraction
  addYears(years: number): DateBuilder;
  addMonths(months: number): DateBuilder;
  addDays(days: number): DateBuilder;
  addHours(hours: number): DateBuilder;
  addMinutes(minutes: number): DateBuilder;
  addSeconds(seconds: number): DateBuilder;
  addMilliseconds(milliseconds: number): DateBuilder;
  subtractYears(years: number): DateBuilder;
  subtractMonths(months: number): DateBuilder;
  subtractDays(days: number): DateBuilder;
  subtractHours(hours: number): DateBuilder;
  subtractMinutes(minutes: number): DateBuilder;
  subtractSeconds(seconds: number): DateBuilder;

  // Start/End of Period
  startOfSecond(): DateBuilder;
  startOfMinute(): DateBuilder;
  startOfHour(): DateBuilder;
  startOfDay(): DateBuilder;
  startOfWeek(): DateBuilder;
  startOfMonth(): DateBuilder;
  startOfQuarter(): DateBuilder;
  startOfYear(): DateBuilder;
  endOfSecond(): DateBuilder;
  endOfMinute(): DateBuilder;
  endOfHour(): DateBuilder;
  endOfDay(): DateBuilder;
  endOfWeek(): DateBuilder;
  endOfMonth(): DateBuilder;
  endOfQuarter(): DateBuilder;
  endOfYear(): DateBuilder;

  // Comparisons
  isBefore(other: Date | DateBuilder): boolean;
  isAfter(other: Date | DateBuilder): boolean;
  isSame(other: Date | DateBuilder): boolean;
  isBetween(start: Date | DateBuilder, end: Date | DateBuilder, inclusive?: boolean): boolean;
  isToday(): boolean;
  isFuture(): boolean;
  isPast(): boolean;
  isWeekend(): boolean;
  isLeapYear(): boolean;

  // Getters
  getYear(): number;
  getMonth(): number; // 1-12, not 0-11
  getDay(): number;
  getDayOfWeek(): number;
  getHour(): number;
  getMinute(): number;
  getSecond(): number;
  getMillisecond(): number;
  getQuarter(): 1 | 2 | 3 | 4;
  getWeekOfYear(): number;
  getDaysInMonth(): number;
  getTime(): number;
  getUnixTimestamp(): number;

  // Difference
  diff(other: Date | DateBuilder, unit?: 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days' | 'months' | 'years'): number;
  diffFromNow(unit?: 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days' | 'months' | 'years'): number;

  // Formatting
  format(options?: DateFormatOptions | string): string;
  formatRelative(locale?: string | string[]): string;
  toISOString(): string;
  toUTCString(): string;
  toDateString(): string;
  toTimeString(): string;
  toLocaleString(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string;
  toJSON(): string;

  // Conversion
  build(): Date;
  toDate(): Date;
  clone(): DateBuilder;
  valueOf(): number;
  toString(): string;
}
```

**Examples:**

```ts
import { DateBuilder } from '@catbee/utils/date';

// Create a specific date
const date = new DateBuilder()
  .year(2024)
  .month(5)
  .day(15)
  .hour(14)
  .minute(30)
  .build();

// Chain operations
const nextWeek = DateBuilder.now()
  .addDays(7)
  .startOfDay()
  .build();

// Use static factory methods
const christmas = DateBuilder.of(2024, 12, 25).build();
const futureDate = DateBuilder.fromDuration('5m').build();

// Fluent comparisons
const isValid = DateBuilder.now()
  .isBetween(startDate, endDate);

// Format dates
const formatted = DateBuilder.now()
  .addMonths(2)
  .endOfMonth()
  .format('yyyy-MM-dd'); // "2026-03-31"

// Complex date manipulation
const result = DateBuilder.from(new Date('2024-01-15'))
  .addYears(1)
  .addMonths(6)
  .startOfMonth()
  .addDays(10)
  .format(); // "2025-07-11"
```

---

### `DateConstants`

Constants for time conversions.

**Constants:**

```ts
const DateConstants = {
  MILLISECONDS_IN_SECOND: 1000,
  MILLISECONDS_IN_MINUTE: 60000,
  MILLISECONDS_IN_HOUR: 3600000,
  MILLISECONDS_IN_DAY: 86400000,
  MILLISECONDS_IN_WEEK: 604800000,
  MILLISECONDS_IN_YEAR: 31536000000,
  MILLISECONDS_IN_LEAP_YEAR: 31622400000,
  MONTHS_IN_YEAR: 12,
  DAYS_IN_WEEK: 7,
  HOURS_IN_DAY: 24,
  MINUTES_IN_HOUR: 60,
  SECONDS_IN_MINUTE: 60
};
```

**Examples:**

```ts
import { DateConstants } from '@catbee/utils/date';

// Convert 5 days to milliseconds
const fiveDaysMs = 5 * DateConstants.MILLISECONDS_IN_DAY;

// Convert 2 weeks to hours
const twoWeeksHours = (2 * DateConstants.MILLISECONDS_IN_WEEK) / DateConstants.MILLISECONDS_IN_HOUR;

// Calculate timeout in milliseconds
const timeout = 30 * DateConstants.MILLISECONDS_IN_MINUTE; // 30 minutes
```

---

### `formatDate()`

Formats a date according to a pattern, locale, and time zone.

**Method Signature:**

```ts
function formatDate(date: Date | number, options?: DateFormatOptions): string;
```

**Parameters:**

- `date`: The date to format (Date object or timestamp).
- `options`: Optional formatting options:
  - `format`: The date format pattern (default: 'yyyy-MM-dd').
  - `locale`: The locale(s) to use for formatting (default: system locale).
  - `timeZone`: The time zone to use (default: system time zone).

**Returns:**

- The formatted date string.

**Examples:**

```ts
import { formatDate } from '@catbee/utils/date';

formatDate(new Date(), { format: 'yyyy-MM-dd' }); // '2023-05-15'
formatDate(new Date(), { format: 'yyyy-MM-dd HH:mm:ss' }); // '2023-05-15 14:30:22'
formatDate(new Date(), { format: 'PPPP', locale: 'fr-FR' }); // 'lundi 15 mai 2023'
```

---

### `formatRelativeTime()`

Formats a date as relative time (e.g., "5 minutes ago", "in 3 days").

**Method Signature:**

```ts
function formatRelativeTime(date: Date | number, now?: Date | number, locale?: string | string[]): string;
```

**Parameters:**

- `date`: The date to format (Date object or timestamp).
- `now`: Optional reference date (default: current date).
- `locale`: Optional locale(s) for formatting (default: system locale).

**Returns:**

- The relative time string.

**Examples:**

```ts
import { formatRelativeTime } from '@catbee/utils/date';

formatRelativeTime(Date.now() - 1000 * 60 * 5); // "5 minutes ago"
formatRelativeTime(Date.now() + 1000 * 60 * 60 * 24 * 3); // "in 3 days"
```

---

### `parseDate()`

Parses a date string or timestamp into a Date object.

**Method Signature:**

```ts
function parseDate(input: string | number, fallback?: Date): Date | null;
```

**Parameters:**

- `input`: The date input (string or timestamp).
- `fallback`: Optional fallback date if parsing fails (default: `null`).

**Returns:**

- The parsed Date object or the fallback value if parsing fails.

**Examples:**

```ts
import { parseDate } from '@catbee/utils/date';

parseDate('2023-05-15'); // Date object for May 15, 2023
parseDate('invalid', new Date()); // Returns current date as fallback
```

---

### `dateDiff()`

Calculates the difference between two dates in the specified unit.

**Method Signature:**

```ts
function dateDiff(date1: Date | number, date2?: Date | number, unit?: 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days' | 'months' | 'years'): number;
```

**Parameters:**

- `date1`: The first date (Date object or timestamp).
- `date2`: The second date (Date object or timestamp). Defaults to the current date if not provided.
- `unit`: The unit for the difference ('milliseconds', 'seconds', 'minutes', 'hours', 'days', 'months', 'years'). Default is 'days'.

**Returns:**

- The difference between the two dates in the specified unit.

**Examples:**

```ts
import { dateDiff } from '@catbee/utils/date';

dateDiff(new Date('2023-05-15'), new Date('2023-05-10'), 'days'); // 5
dateDiff(new Date('2023-05-15T10:00:00'), new Date('2023-05-15T06:00:00'), 'hours'); // 4
```

---

### `addToDate()`

Adds a specified amount of time to a date.

**Method Signature:**

```ts
function addToDate(date: Date | number, amount: number, unit: 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days' | 'months' | 'years'): Date;
```

**Parameters:**

- `date`: The original date (Date object or timestamp).
- `amount`: The amount of time to add (can be negative to subtract).
- `unit`: The unit of time to add ('milliseconds', 'seconds', 'minutes', 'hours', 'days', 'months', 'years').

**Returns:**

- The new date with the added time.

**Examples:**

```ts
import { addToDate } from '@catbee/utils/date';

addToDate(new Date('2023-05-15'), 5, 'days'); // Date for May 20, 2023
addToDate(new Date('2023-05-15T10:00:00'), -2, 'hours'); // Date for May 15, 2023 08:00:00
```

---

### `startOf()`

Gets the start of a time period containing the specified date.

**Method Signature:**

```ts
function startOf(date: Date | number, unit: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year'): Date;
```

**Parameters:**

- `date`: The date to evaluate (Date object or timestamp).
- `unit`: The unit of time to get the start of ('second', 'minute', 'hour', 'day', 'week', 'month', 'quarter', 'year').

**Returns:**

- The Date object representing the start of the specified time period.

**Examples:**

```ts
import { startOf } from '@catbee/utils/date';

startOf(new Date('2023-05-15T14:30:00'), 'day'); // Date for May 15, 2023 00:00:00
startOf(new Date('2023-05-15'), 'month'); // Date for May 1, 2023
```

---

### `endOf()`

Gets the end of a time period containing the specified date.

**Method Signature:**

```ts
function endOf(date: Date | number, unit: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year'): Date;
```

**Parameters:**

- `date`: The date to evaluate (Date object or timestamp).
- `unit`: The unit of time to get the end of ('second', 'minute', 'hour', 'day', 'week', 'month', 'quarter', 'year').

**Returns:**

- The Date object representing the end of the specified time period.

**Examples:**

```ts
import { endOf } from '@catbee/utils/date';

endOf(new Date('2023-05-15T14:30:00'), 'day'); // Date for May 15, 2023 23:59:59.999
endOf(new Date('2023-05-15'), 'month'); // Date for May 31, 2023 23:59:59.999
```

---

### `isBetween()`

Checks if a date is between two other dates.

**Method Signature:**

```ts
function isBetween(date: Date | number, start: Date | number, end: Date | number, inclusive?: boolean): boolean;
```

**Parameters:**

- `date`: The date to check (Date object or timestamp).
- `start`: The start date of the range (Date object or timestamp).
- `end`: The end date of the range (Date object or timestamp).
- `inclusive`: Optional boolean to include the start and end dates in the check (default: `true`).

**Returns:**

- `true` if the date is between the start and end dates, otherwise `false`.

**Examples:**

```ts
import { isBetween } from '@catbee/utils/date';

const date = new Date('2023-05-15');
const start = new Date('2023-05-10');
const end = new Date('2023-05-20');
isBetween(date, start, end); // true
isBetween(date, start, end, false); // true (exclusive)
```

---

### `isLeapYear()`

Checks if a year is a leap year.

**Method Signature:**

```ts
function isLeapYear(year: number | Date): boolean;
```

**Parameters:**

- `year`: The year to check (number or Date object).

**Returns:**

- `true` if the year is a leap year, otherwise `false`.

**Examples:**

```ts
import { isLeapYear } from '@catbee/utils/date';

isLeapYear(2024); // true
isLeapYear(new Date('2023-01-01')); // false
```

---

### `daysInMonth()`

Gets the number of days in a month.

**Method Signature:**

```ts
function daysInMonth(year: number | Date, month?: number): number;
```

**Parameters:**

- `year`: The year to check (number or Date object).
- `month`: The month to check (0-based, optional).

**Returns:**

- The number of days in the specified month.

**Examples:**

```ts
import { daysInMonth } from '@catbee/utils/date';

daysInMonth(2024, 1); // 29 (February in a leap year)
daysInMonth(new Date('2023-05-15')); // 31 (May 2023)
```

---

### `formatDuration()`

Formats a duration given in milliseconds to a human-readable string.

**Method Signature:**

```ts
function formatDuration(ms: number): string;
```

**Parameters:**

- `ms`: Duration in milliseconds.

**Returns:**

- A human-readable duration string (e.g., "1h 1m 1s", "1m 30s 61ms").

**Examples:**

```ts
import { formatDuration } from '@catbee/utils/date';

formatDuration(3661000); // "1h 1m 1s"
formatDuration(90061); // "1m 30s 61ms"
formatDuration(0); // "0ms"
```

---

### `parseDuration()`

Parses a duration string or number into milliseconds.

**Method Signature:**

```ts
function parseDuration(value: string | number): number;
```

**Parameters:**

- `value`: Duration string (e.g., "1y", "2w", "3d", "4h", "5m", "6s", "7ms", "1w2d3h") or number in milliseconds.

**Returns:**

- Duration in milliseconds.

**Throws:**

- `Error` if the duration string is invalid.

**Examples:**

```ts
import { parseDuration } from '@catbee/utils/date';

parseDuration('5m'); // 300000 (5 minutes)
parseDuration('2h'); // 7200000 (2 hours)
parseDuration('1d'); // 86400000 (1 day)
parseDuration('1w2d3h'); // Complex duration
parseDuration(60000); // 60000 (plain milliseconds)
```

---

### `getDateFromDuration()`

Converts a duration string into a Date object representing the future time from now.

**Method Signature:**

```ts
function getDateFromDuration(input: string): Date;
```

**Parameters:**

- `input`: Duration string (e.g., "5m", "2h", "1d").

**Returns:**

- Date object representing the future time.

**Throws:**

- `Error` if the duration is invalid or non-positive.

**Examples:**

```ts
import { getDateFromDuration } from '@catbee/utils/date';

getDateFromDuration('5m'); // Date 5 minutes from now
getDateFromDuration('2h'); // Date 2 hours from now
getDateFromDuration('1d'); // Date 1 day from now
```

---

### `isWeekend()`

Checks if a date is on a weekend (Saturday or Sunday).

**Method Signature:**

```ts
function isWeekend(date: Date | number): boolean;
```

**Parameters:**

- `date`: The date to check.

**Returns:**

- `true` if the date is a weekend, otherwise `false`.

**Examples:**

```ts
import { isWeekend } from '@catbee/utils/date';

isWeekend(new Date('2024-01-06')); // true (Saturday)
isWeekend(new Date('2024-01-08')); // false (Monday)
```

---

### `isToday()`

Checks if a date is today.

**Method Signature:**

```ts
function isToday(date: Date | number): boolean;
```

**Parameters:**

- `date`: The date to check.

**Returns:**

- `true` if the date is today, otherwise `false`.

**Examples:**

```ts
import { isToday } from '@catbee/utils/date';

isToday(new Date()); // true
isToday(new Date('2020-01-01')); // false
```

---

### `isFuture()`

Checks if a date is in the future.

**Method Signature:**

```ts
function isFuture(date: Date | number): boolean;
```

**Parameters:**

- `date`: The date to check.

**Returns:**

- `true` if the date is in the future, otherwise `false`.

**Examples:**

```ts
import { isFuture } from '@catbee/utils/date';

isFuture(new Date('2099-01-01')); // true
isFuture(new Date('2020-01-01')); // false
```

---

### `isPast()`

Checks if a date is in the past.

**Method Signature:**

```ts
function isPast(date: Date | number): boolean;
```

**Parameters:**

- `date`: The date to check.

**Returns:**

- `true` if the date is in the past, otherwise `false`.

**Examples:**

```ts
import { isPast } from '@catbee/utils/date';

isPast(new Date('2020-01-01')); // true
isPast(new Date('2099-01-01')); // false
```

---

### `addDays()`

Adds days to a date.

**Method Signature:**

```ts
function addDays(date: Date | number, days: number): Date;
```

**Parameters:**

- `date`: The base date.
- `days`: Number of days to add (can be negative to subtract).

**Returns:**

- New date with days added.

**Examples:**

```ts
import { addDays } from '@catbee/utils/date';

addDays(new Date('2024-01-15'), 7); // 2024-01-22
addDays(new Date('2024-01-15'), -3); // 2024-01-12
```

---

### `addMonths()`

Adds months to a date.

**Method Signature:**

```ts
function addMonths(date: Date | number, months: number): Date;
```

**Parameters:**

- `date`: The base date.
- `months`: Number of months to add (can be negative to subtract).

**Returns:**

- New date with months added.

**Examples:**

```ts
import { addMonths } from '@catbee/utils/date';

addMonths(new Date('2024-01-31'), 1); // 2024-02-29 (leap year)
addMonths(new Date('2024-03-31'), 1); // 2024-04-30 (April has 30 days)
```

---

### `addYears()`

Adds years to a date.

**Method Signature:**

```ts
function addYears(date: Date | number, years: number): Date;
```

**Parameters:**

- `date`: The base date.
- `years`: Number of years to add (can be negative to subtract).

**Returns:**

- New date with years added.

**Examples:**

```ts
import { addYears } from '@catbee/utils/date';

addYears(new Date('2024-01-15'), 5); // 2029-01-15
addYears(new Date('2024-01-15'), -2); // 2022-01-15
```

---

### `quarterOf()`

Gets the quarter of the year for a date (1-4).

**Method Signature:**

```ts
function quarterOf(date: Date | number): 1 | 2 | 3 | 4;
```

**Parameters:**

- `date`: The date.

**Returns:**

- Quarter number (1, 2, 3, or 4).

**Examples:**

```ts
import { quarterOf } from '@catbee/utils/date';

quarterOf(new Date('2024-03-15')); // 1 (Q1: Jan-Mar)
quarterOf(new Date('2024-07-15')); // 3 (Q3: Jul-Sep)
quarterOf(new Date('2024-12-31')); // 4 (Q4: Oct-Dec)
```

---

### `weekOfYear()`

Gets the ISO week number of the year for a date.

**Method Signature:**

```ts
function weekOfYear(date: Date | number): number;
```

**Parameters:**

- `date`: The date.

**Returns:**

- Week number (1-53).

**Examples:**

```ts
import { weekOfYear } from '@catbee/utils/date';

weekOfYear(new Date('2024-01-15')); // 3
weekOfYear(new Date('2024-12-31')); // 1 (of next year)
```

---
