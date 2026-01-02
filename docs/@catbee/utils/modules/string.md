---
slug: ../string
---

# String

Helpers for manipulating and formatting strings. Includes casing conversions, masking, slugifying, truncating, reversing, counting, and more. All methods are fully typed.

## API Summary

- [**`capitalize(str: string)`**](#capitalize) - Capitalizes the first character of a string.
- [**`toKebabCase(str: string)`**](#tokebabcase) - Converts a string to kebab-case.
- [**`toCamelCase(str: string)`**](#tocamelcase) - Converts a string to camelCase.
- [**`slugify(str: string)`**](#slugify) - Converts a string to a URL-friendly slug.
- [**`truncate(str: string, len: number)`**](#truncate) - Truncates a string to a specific length, appending '...' if truncated.
- [**`toPascalCase(str: string)`**](#topascalcase) - Converts a string to PascalCase.
- [**`toSnakeCase(str: string)`**](#tosnakecase) - Converts a string to snake_case.
- [**`mask(str: string, visibleStart = 0, visibleEnd = 0, maskChar = '*')`**](#mask) - Masks a string by replacing characters with a mask character.
- [**`stripHtml(str: string)`**](#striphtml) - Removes all HTML tags from a string.
- [**`equalsIgnoreCase(a: string, b: string)`**](#equalsignorecase) - Performs case-insensitive string comparison.
- [**`reverse(str: string)`**](#reverse) - Reverses a string.
- [**`countOccurrences(str: string, substring: string, caseSensitive = true)`**](#countoccurrences) - Counts occurrences of a substring within a string.
- [**`toTitleCase(str: string)`**](#totitlecase) - Converts a string to Title Case.
- [**`escapeRegex(str: string)`**](#escaperegex) - Escapes special regex characters in a string.
- [**`unescapeHtml(str: string)`**](#unescapehtml) - Unescapes HTML entities in a string.
- [**`isBlank(str: string)`**](#isblank) - Checks if a string is blank (empty or only whitespace).
- [**`ellipsis(str: string, maxLength: number, suffix = '...')`**](#ellipsis) - Truncates a string with an ellipsis, ensuring word boundaries.

---

## Function Documentation & Usage Examples

### `capitalize()`

Capitalizes the first character of a string.

**Method Signature:**

```ts
function capitalize(str: string): string;
```

**Parameters:**

- `str`: The string to capitalize.

**Returns:**

- The capitalized string.

**Example:**

```ts
import { capitalize } from '@catbee/utils/string';

capitalize('hello world'); // "Hello world"
```

---

### `toKebabCase()`

Converts a string to kebab-case.

**Method Signature:**

```ts
function toKebabCase(str: string): string;
```

**Parameters:**

- `str`: The string to convert.

**Returns:**

- The kebab-case string.

**Example:**

```ts
import { toKebabCase } from '@catbee/utils/string';

toKebabCase('FooBar test'); // "foo-bar-test"
```

---

### `toCamelCase()`

Converts a string to camelCase.

**Method Signature:**

```ts
function toCamelCase(str: string): string;
```

**Parameters:**

- `str`: The string to convert.

**Returns:**

- The camelCase string.

**Example:**

```ts
import { toCamelCase } from '@catbee/utils/string';

toCamelCase('foo-bar_test'); // "fooBarTest"
```

---

### `slugify()`

Converts a string to a URL-friendly slug.

**Method Signature:**

```ts
function slugify(str: string): string;
```

**Parameters:**

- `str`: The string to convert.

**Returns:**

- The URL-friendly slug.

**Example:**

```ts
import { slugify } from '@catbee/utils/string';

slugify('Hello World!'); // "hello-world"
```

---

### `truncate()`

Truncates a string to a specific length, appending '...' if truncated.

**Method Signature:**

```ts
function truncate(str: string, len: number): string;
```

**Parameters:**

- `str`: The string to truncate.
- `len`: The maximum length of the truncated string.

**Returns:**

- The truncated string.

**Example:**

```ts
import { truncate } from '@catbee/utils/string';

truncate('This is a long sentence.', 10); // "This is a ..."
```

---

### `toPascalCase()`

Converts a string to PascalCase.

**Method Signature:**

```ts
function toPascalCase(str: string): string;
```

**Parameters:**

- `str`: The string to convert.

**Returns:**

- The PascalCase string.

**Example:**

```ts
import { toPascalCase } from '@catbee/utils/string';

toPascalCase('foo-bar'); // "FooBar"
```

---

### `toSnakeCase()`

Converts a string to snake_case.

**Method Signature:**

```ts
function toSnakeCase(str: string): string;
```

**Parameters:**

- `str`: The string to convert.

**Returns:**

- The snake_case string.

**Example:**

```ts
import { toSnakeCase } from '@catbee/utils/string';

toSnakeCase('FooBar test'); // "foo_bar_test"
```

---

### `mask()`

Masks a string by replacing characters with a mask character.

**Method Signature:**

```ts
function mask(str: string, visibleStart?: number, visibleEnd?: number, maskChar?: string): string;
```

**Parameters:**

- `str`: The string to mask.
- `visibleStart`: Number of characters to leave visible at the start (default: 0).
- `visibleEnd`: Number of characters to leave visible at the end (default: 0).
- `maskChar`: The character to use for masking (default: '\*').

**Returns:**

- The masked string.

**Example:**

```ts
import { mask } from '@catbee/utils/string';

mask('hello world', 2, 5, '*'); // "he***world"
```

---

### `stripHtml()`

Removes all HTML tags from a string.

**Method Signature:**

```ts
function stripHtml(str: string): string;
```

**Parameters:**

- `str`: The string to process.

**Returns:**

- The string without HTML tags.

**Example:**

```ts
import { stripHtml } from '@catbee/utils/string';

stripHtml('<div>Hello <b>world</b></div>'); // "Hello world"
```

---

### `equalsIgnoreCase()`

Performs case-insensitive string comparison.

**Method Signature:**

```ts
function equalsIgnoreCase(a: string, b: string): boolean;
```

**Parameters:**

- `a`: The first string to compare.
- `b`: The second string to compare.

**Returns:**

- `true` if the strings are equal ignoring case, otherwise `false`.

**Example:**

```ts
import { equalsIgnoreCase } from '@catbee/utils/string';

equalsIgnoreCase('Hello', 'hello'); // true
```

---

### `reverse()`

Reverses a string.

**Method Signature:**

```ts
function reverse(str: string): string;
```

**Parameters:**

- `str`: The string to reverse.

**Returns:**

- The reversed string.

**Example:**

```ts
import { reverse } from '@catbee/utils/string';

reverse('abc'); // "cba"
```

---

### `countOccurrences()`

Counts occurrences of a substring within a string.

**Method Signature:**

```ts
function countOccurrences(str: string, substring: string, caseSensitive: boolean = true): number;
```

**Parameters:**

- `str`: The string to search within.
- `substring`: The substring to count.
- `caseSensitive`: Whether the search should be case-sensitive (default: true).

**Returns:**

- The number of occurrences of the substring.

**Example:**

```ts
import { countOccurrences } from '@catbee/utils/string';

countOccurrences('banana', 'an');        // 2 (case-sensitive)
countOccurrences('Banana', 'an');        // 1 (case-sensitive, only lowercase 'an')
countOccurrences('Banana', 'an', false); // 2 (case-insensitive)
```

---

### `toTitleCase()`

Converts a string to Title Case (each word capitalized).

**Method Signature:**

```ts
function toTitleCase(str: string): string;
```

**Parameters:**

- `str`: The string to convert.

**Returns:**

- The Title Case string.

**Example:**

```ts
import { toTitleCase } from '@catbee/utils/string';

toTitleCase('hello world'); // "Hello World"
toTitleCase('the quick brown fox'); // "The Quick Brown Fox"
```

---

### `escapeRegex()`

Escapes special regex characters in a string.

**Method Signature:**

```ts
function escapeRegex(str: string): string;
```

**Parameters:**

- `str`: The string to escape.

**Returns:**

- The string with regex characters escaped.

**Example:**

```ts
import { escapeRegex } from '@catbee/utils/string';

escapeRegex('Hello (world)'); // "Hello \\(world\\)"
escapeRegex('$100.00'); // "\\$100\\.00"
```

---

### `unescapeHtml()`

Unescapes HTML entities in a string.

**Method Signature:**

```ts
function unescapeHtml(str: string): string;
```

**Parameters:**

- `str`: The HTML string with entities.

**Returns:**

- The string with HTML entities unescaped.

**Example:**

```ts
import { unescapeHtml } from '@catbee/utils/string';

unescapeHtml('&lt;div&gt;Hello&lt;/div&gt;'); // "<div>Hello</div>"
unescapeHtml('&quot;Hello&quot;'); // '"Hello"'
```

---

### `isBlank()`

Checks if a string is blank (empty or only whitespace).

**Method Signature:**

```ts
function isBlank(str: string): boolean;
```

**Parameters:**

- `str`: The string to check.

**Returns:**

- `true` if the string is blank, otherwise `false`.

**Example:**

```ts
import { isBlank } from '@catbee/utils/string';

isBlank('   '); // true
isBlank(''); // true
isBlank('hello'); // false
```

---

### `ellipsis()`

Truncates a string with an ellipsis, ensuring word boundaries.

**Method Signature:**

```ts
function ellipsis(str: string, maxLength: number, suffix: string = '...'): string;
```

**Parameters:**

- `str`: The string to truncate.
- `maxLength`: Maximum length of the result.
- `suffix`: Suffix to append when truncated (default: '...').

**Returns:**

- The truncated string with suffix.

**Example:**

```ts
import { ellipsis } from '@catbee/utils/string';

ellipsis('The quick brown fox', 10); // "The quick..."
ellipsis('Short', 10); // "Short"
ellipsis('The quick brown fox', 15, '…'); // "The quick…"
```
