---
slug: ../request
---

# Request

Helpers for parsing and validating HTTP request parameters. Includes utilities for parsing numbers and booleans, extracting pagination, sorting, and filter parameters from query objects. All methods are fully typed.

## API Summary

- [**`getPaginationParams<T>(req: Request): WithPagination<T>`**](#getpaginationparams) - Extracts pagination, sorting, and search params from a request.
- [**`parseNumberParam(value: string | undefined, options = {})`**](#parsenumberparam) - Safely parses a string parameter to a number.
- [**`parseBooleanParam(value: string | undefined, options = {})`**](#parsebooleanparam) - Safely parses a string parameter to a boolean.
- [**`extractPaginationParams(query, defaultPage = 1, defaultLimit = 20, maxLimitSize = 100)`**](#extractpaginationparams) - Extracts pagination parameters from query.
- [**`extractSortParams(query, allowedFields, defaultSort?)`**](#extractsortparams) - Extracts sorting parameters from query.
- [**`extractFilterParams(query, allowedFilters)`**](#extractfilterparams) - Extracts filter parameters from query.

---

## Interfaces & Types

```ts
export interface ValidationOptions {
  throwOnError?: boolean;
  errorMessage?: string;
  defaultValue?: any;
  required?: boolean;
}

export interface ValidationResult<T> {
  isValid: boolean;
  value: T | null;
  error?: string;
}

export interface WithPagination<T> {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  search?: string;
}
```

---

## Function Documentation & Usage Examples

### `getPaginationParams()`

Extracts pagination, sorting, and optional search parameters from an Express request.

**Method Signature:**

```ts
function getPaginationParams<T = {}>(req: Request): WithPagination<T>;
```

**Parameters:**

- `req`: The Express request object.

**Returns:**

- An object containing:
  - `page`: The validated page number (default: 1).
  - `limit`: The validated limit number (default: 20, max: 100).
  - `sortBy`: The field to sort by (default: 'createdAt').
  - `sortOrder`: The sort direction (default: 'desc').
  - `search`: Optional search string from query.
  - Additional query parameters as type T.

**Example:**

```ts
import { getPaginationParams } from '@catbee/utils/request';

app.get('/api/users', (req, res) => {
  const params = getPaginationParams(req);
  // params = { page: 1, limit: 20, sortBy: 'createdAt', sortOrder: 'desc', search: '...' }
  const users = await userService.findAll(params);
  res.json(users);
});
```

---

### `parseNumberParam()`

Safely parses a string parameter to a number, with validation and error handling.

**Method Signature:**

```ts
function parseNumberParam(value: string | undefined, options: ValidationOptions = {}): ValidationResult<number>;
```

**Parameters:**

- `value`: The string value to parse.
- `options`: Optional validation options (default: {}):
  - `throwOnError`: If true, throws an error on invalid input.
  - `errorMessage`: Custom error message for invalid input.
  - `defaultValue`: Default value to return if input is invalid or undefined.
  - `required`: If true, input must be provided.

**Returns:**

- An object containing:
  - `isValid`: Boolean indicating if the parsing was successful.
  - `value`: The parsed number or null if invalid.
  - `error`: Optional error message if parsing failed.

**Examples:**

```ts
import { parseNumberParam } from '@catbee/utils/request';

const result = parseNumberParam(req.query.id, { required: true });
if (result.isValid) {
  // Use result.value as a number
}
```

---

### `parseBooleanParam()`

Safely parses a string parameter to a boolean, supporting various formats.

**Method Signature:**

```ts
function parseBooleanParam(value: string | undefined, options: ValidationOptions = {}): ValidationResult<boolean>;
```

**Parameters:**

- `value`: The string value to parse.
- `options`: Optional validation options (default: {}):
  - `throwOnError`: If true, throws an error on invalid input.
  - `errorMessage`: Custom error message for invalid input.
  - `defaultValue`: Default value to return if input is invalid or undefined.
  - `required`: If true, input must be provided.

**Returns:**

- An object containing:
  - `isValid`: Boolean indicating if the parsing was successful.
  - `value`: The parsed boolean or null if invalid.
  - `error`: Optional error message if parsing failed.

**Examples:**

```ts
import { parseBooleanParam } from '@catbee/utils/request';

const result = parseBooleanParam(req.query.active, { defaultValue: false });
if (result.isValid) {
  // Use result.value as a boolean
}
```

---

### `extractPaginationParams()`

Extracts validated pagination parameters (`page`, `limit`) from query object.

**Method Signature:**

```ts
function extractPaginationParams(
  query: Record<string, string | string[]>,
  defaultPage: number = 1,
  defaultLimit: number = 20,
  maxLimitSize: number = 100
): { page: number; limit: number };
```

**Parameters:**

- `query`: The query object from which to extract parameters.
- `defaultPage`: Default page number if not provided (default: 1).
- `defaultLimit`: Default limit if not provided (default: 20).
- `maxLimitSize`: Maximum allowed limit size (default: 100).

**Returns:**

- An object containing:
  - `page`: The validated page number.
  - `limit`: The validated limit number.

**Example:**

```ts
import { extractPaginationParams } from '@catbee/utils/request';

const { page, limit } = extractPaginationParams(req.query, 1, 20, 100);
```

---

### `extractSortParams()`

Extracts sorting parameters (`sortBy`, `sortOrder`) from query object, validating against allowed fields.

**Method Signature:**

```ts
const DEFAULT_SORT = { sortBy: 'createdAt', sortOrder: 'desc' };

function extractSortParams(
  query: Record<string, string | string[]>,
  allowedFields: string[],
  defaultSort: { sortBy: string; sortOrder: 'asc' | 'desc' } = DEFAULT_SORT
): { sortBy: string; sortOrder: 'asc' | 'desc' };
```

**Parameters:**

- `query`: The query object from which to extract parameters.
- `allowedFields`: Array of allowed fields for sorting.
- `defaultSort`: Optional default sorting if parameters are not provided (default: `{ sortBy: 'createdAt', sortOrder: 'desc' }`).

**Returns:**

- An object containing:
  - `sortBy`: The field to sort by.
  - `sortOrder`: The order of sorting, either 'asc' or 'desc'.

**Example:**

```ts
import { extractSortParams } from '@catbee/utils/request';

const { sortBy, sortOrder } = extractSortParams(req.query, ['name', 'createdAt'], { sortBy: 'name', sortOrder: 'asc' });
```

---

### `extractFilterParams()`

Extracts filter parameters from query object based on allowed filter fields.

**Method Signature:**

```ts
function extractFilterParams(
  query: Record<string, string | string[]>,
  allowedFilters: string[]
): Record<string, string | string[]>
```

**Parameters:**

- `query`: The query object from which to extract parameters.
- `allowedFilters`: Array of allowed fields for filtering.

**Returns:**

- An object containing only the allowed filter parameters.

**Example:**

```ts
import { extractFilterParams } from '@catbee/utils/request';

const filters = extractFilterParams(req.query, ['status', 'type']);
```
