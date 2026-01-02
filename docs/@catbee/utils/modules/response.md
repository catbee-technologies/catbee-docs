---
slug: ../response
---

# Response

Helpers for standardized API responses. Includes classes and functions for success, error, paginated, no-content, and redirect responses, plus utilities for creating and sending responses. All methods are fully typed.

## API Summary

### Classes

- [**`SuccessResponse<T>`**](#successresponset) - Standard HTTP response wrapper for successful responses.
- [**`ErrorResponse`**](#errorresponse) - Wrapper for error responses, extends native Error.
- [**`PaginatedResponse<T>`**](#paginatedresponset) - Response with paginated data, extends SuccessResponse.
- [**`NoContentResponse`**](#nocontentresponse) - Specialized response for operations that don't return data (HTTP 204).
- [**`RedirectResponse`**](#redirectresponse) - Specialized response for redirects.

### Functions

- [**`createSuccessResponse(data: T, message = 'Success'): SuccessResponse<T>`**](#createsuccessresponse) - Creates a standard success response.
- [**`createErrorResponse(message: string, statusCode = 500): ErrorResponse`**](#createerrorresponse) - Creates a standard error response.
- [**`createFinalErrorResponse(req: Request, status: number, message: string, error?: any, options?: { includeDetails?: boolean }): ApiErrorResponse`**](#createfinalerrorresponse) - Creates a final error response.
- [**`createPaginatedResponse<T>(allItems: T[], page: number, pageSize: number, message = 'Success'): PaginatedResponse<T>`**](#createpaginatedresponse) - Creates a paginated response from array data.
- [**`sendResponse(res: Response, apiResponse: ApiResponse<any>): void`**](#sendresponse) - Adapter to convert API responses to Express.js response format.

---

## Interfaces & Types

```ts
export interface ApiResponse<T> {
  message: string;
  error: boolean;
  data: T | null;
  timestamp: string;
  requestId: string;
}

export interface ApiErrorResponse {
  error: true;
  message: string;
  timestamp: string;
  requestId: string;
  status: number;
  path?: string;
  stack?: string[];
}
```

---

## Function Documentation & Usage Examples

### `SuccessResponse<T>`

Standard HTTP response wrapper for successful responses.

**Method Signature:**

```ts
class SuccessResponse<T> implements ApiResponse<T> {
  message: string = 'Success';
  error: boolean = false;
  data: T | null = null;
  timestamp: string = new Date().toISOString();
  requestId: string = getRequestId() ?? uuid();
  constructor(message: string, data?: T);
}
```

**Parameters:**

- `message`: A message describing the response.
- `data`: Optional response data of type T (default: null).

**Examples:**

```ts
import { SuccessResponse } from '@catbee/utils/response';

const resp = new SuccessResponse<{ id: number }>('OK', { id: 1 });
/*
  {
    message: 'OK',
    error: false,
    data: { id: 1 },
    timestamp: '2023-10-05T12:00:00Z',
    requestId: 'a2ef4c8d-1234-5678-90ab-cdef12345678'
  }
*/
app.get('/item', (req, res) => {
  const item = { id: 1 }; // fetched item
  const resp = new SuccessResponse('Item fetched', item);
  res.status(200).json(resp);
});
```

---

### `ErrorResponse`

Wrapper for error responses, extends native Error.

**Method Signature:**

```ts
class ErrorResponse extends Error implements Omit<ApiResponse<never>, 'data'> {
  status: number;
  error: boolean = true;
  message: string;
  timestamp: string = new Date().toISOString();
  requestId: string = getRequestId() ?? uuid();
  constructor(message: string, status: number = 500);
}
```

**Parameters:**

- `message`: A message describing the error.
- `status`: The HTTP status code for the error (default: 500).

**Examples:**

```ts
import { ErrorResponse } from '@catbee/utils/response';

const errResp = new ErrorResponse('Not found', 404);
/*
  {
    error: true,
    message: 'Not found',
    timestamp: '2023-10-05T12:00:00Z',
    requestId: 'a2ef4c8d-1234-5678-90ab-cdef12345678',
    status: 404
  }
*/
app.get('/item', (req, res) => {
  // ... item fetching logic ...
  if (!item) {
    const errResp = new ErrorResponse('Item not found', 404);
    res.status(errResp.status).json(errResp);
    return;
  }
  res.status(200).json(new SuccessResponse('Item fetched', item));
});
```

---

### `PaginatedResponse<T>`

Response with paginated data, extends SuccessResponse.

**Method Signature:**

```ts
class PaginatedResponse<T> extends SuccessResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  constructor(items: T[], pagination: { total: number; page: number; pageSize: number }, message: string = 'Success');
}
```

**Parameters:**

- `items`: An array of items of type T.
- `pagination`: An object containing pagination details:
  - `total`: Total number of items.
  - `page`: Current page number.
  - `pageSize`: Number of items per page.
- `message`: A message describing the response (default: 'Success').

**Examples:**

```ts
import { PaginatedResponse } from '@catbee/utils/response';

const paged = new PaginatedResponse([1, 2, 3], { total: 100, page: 1, pageSize: 3 }, 'Success');
/*
  {
    message: 'Success',
    error: false,
    data: [1, 2, 3],
    total: 100,
    page: 1,
    pageSize: 3,
    totalPages: 34,
    hasNext: true,
    hasPrevious: false,
    timestamp: '2023-10-05T12:00:00Z',
    requestId: 'a2ef4c8d-1234-5678-90ab-cdef12345678'
  }
*/
app.get('/items', (req, res) => {
  const items = [
    /* fetch items based on req.query.page and req.query.pageSize */
  ];
  const totalItems = 100; // total count from database
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;

  const pagedResponse = new PaginatedResponse(items, { total: totalItems, page, pageSize }, 'Items fetched');
  res.status(HttpStatusCodes.OK).json(pagedResponse);
});
```

---

### `NoContentResponse`

Specialized response for operations that don't return data (HTTP 204). Works only with `sendResponse()` method.

**Method Signature:**

```ts
class NoContentResponse extends SuccessResponse<null> {
  constructor(message: string = 'Operation completed successfully');
}
```

**Parameters:**

- `message`: A message describing the response (default: 'Operation completed successfully').

**Examples:**

```ts
import { NoContentResponse, sendResponse } from '@catbee/utils/response';

const resp = new NoContentResponse(); // Uses default message
/*
  {
    message: 'Operation completed successfully',
    error: false,
    data: null,
    timestamp: '2023-10-05T12:00:00Z',
    requestId: 'a2ef4c8d-1234-5678-90ab-cdef12345678'
  }
*/
app.get('/delete-item', (req, res) => {
  // ... delete item logic ...
  const resp = new NoContentResponse('Item deleted');
  sendResponse(res, resp); // Sends HTTP 204 No Content
});
```

---

### `RedirectResponse`

Specialized response for redirects.

**Method Signature:**

```ts
class RedirectResponse {
  redirectUrl: string;
  statusCode: number;
  isRedirect: boolean = true;
  requestId: string = getRequestId() ?? uuid();
  constructor(url: string, statusCode: number = 302);
}
```

**Parameters:**

- `url`: The URL to redirect to.
- `statusCode`: The HTTP status code for the redirect (default: 302).

**Examples:**

```ts
import { RedirectResponse, sendResponse } from '@catbee/utils/response';

const redirect = new RedirectResponse('https://example.com', 302);
/*
  {
    redirectUrl: 'https://example.com',
    statusCode: 302,
    isRedirect: true,
    requestId: 'a2ef4c8d-1234-5678-90ab-cdef12345678'
  }
*/
app.get('/old-route', (req, res) => {
  const redirect = new RedirectResponse('https://example.com/new-route', 301);
  sendResponse(res, redirect); // Sends HTTP 301 Moved Permanently
});
```

---

### `createSuccessResponse()`

Creates a standard success response.

**Method Signature:**

```ts
function createSuccessResponse<T>(data: T, message: string = 'Success'): SuccessResponse<T>;
```

**Parameters:**

- `data`: The response data of type T.
- `message`: A message describing the response (default: 'Success').

**Returns:**

- A SuccessResponse object.

**Example:**

```ts
import { createSuccessResponse } from '@catbee/utils/response';

const resp = createSuccessResponse({ id: 1 }, 'OK');
/*
  {
    message: 'OK',
    error: false,
    data: { id: 1 },
    timestamp: '2023-10-05T12:00:00Z',
    requestId: 'a2ef4c8d-1234-5678-90ab-cdef12345678'
  }
*/
app.get('/item', (req, res) => {
  const item = { id: 1 }; // fetched item
  const resp = createSuccessResponse(item, 'Item fetched');
  res.status(200).json(resp);
});
```

---

### `createErrorResponse()`

Creates a standard error response.

**Method Signature:**

```ts
function createErrorResponse(message: string, statusCode: number = 500): ErrorResponse;
```

**Parameters:**

- `message`: A message describing the error.
- `statusCode`: The HTTP status code for the error (default: 500).

**Returns:**

- An ErrorResponse object.

**Example:**

```ts
import { createErrorResponse } from '@catbee/utils/response';

const errResp = createErrorResponse('Not found', 404);
/*
  {
    error: true,
    message: 'Not found',
    timestamp: '2023-10-05T12:00:00Z',
    requestId: 'a2ef4c8d-1234-5678-90ab-cdef12345678',
    status: 404
  }
*/
app.get('/item', (req, res) => {
  // ... item fetching logic ...
  if (!item) {
    const errResp = createErrorResponse('Item not found', 404);
    res.status(errResp.status).json(errResp);
    return;
  }
  res.status(200).json(createSuccessResponse(item, 'Item fetched'));
});
```

---

### `createFinalErrorResponse()`

Creates a final error response.

**Method Signature:**

```ts
function createFinalErrorResponse(
  req: Request,
  status: number,
  message: string,
  error?: any,
  options?: { includeDetails?: boolean }
): ApiErrorResponse;
```

**Parameters:**

- `req`: The Express request object.
- `status`: The HTTP status code for the error.
- `message`: A message describing the error.
- `error`: Optional original error object for additional details.
- `options`: Optional settings.
  - `includeDetails`: Whether to include error details in the response (default: false). Only includes stack trace in development mode.

**Returns:**

- An ApiErrorResponse object.

```ts
import { Env, createFinalErrorResponse } from '@catbee/utils/response';

const errResp = createFinalErrorResponse(new Error('Something went wrong'));
/*
  {
    error: true,
    message: 'Something went wrong',
    timestamp: '2023-10-05T12:00:00Z',
    requestId: 'a2ef4c8d-1234-5678-90ab-cdef12345678',
    status: 500,
    path: '/current/request/path',
    stack: [ 'Error: Something went wrong', ' at ...' ] // if includeDetails is true
  }
*/
app.get('/item', (req, res) => {
  try {
    // ... item fetching logic ...
    if (!item) {
      throw new Error('Item not found');
    }
    res.status(200).json(createSuccessResponse(item, 'Item fetched'));
  } catch (err) {
    const errResp = createFinalErrorResponse(req, 500, err.message, err, { includeDetails: Env.isDev() });
    res.status(errResp.status).json(errResp);
  }
});
```

### `createPaginatedResponse()`

Creates a paginated response from array data.

**Method Signature:**

```ts
function createPaginatedResponse<T>(
  allItems: T[],
  page: number,
  pageSize: number,
  message: string = 'Success'
): PaginatedResponse<T>;
```

**Parameters:**

- `allItems`: The full array of items to paginate.
- `page`: The current page number (1-based).
- `pageSize`: The number of items per page.
- `message`: A message describing the response (default: 'Success').

**Returns:**

- A PaginatedResponse object.

**Example:**

```ts
import { createPaginatedResponse } from '@catbee/utils/response';

const resp = createPaginatedResponse([1, 2, 3, 4, 5], 1, 2);
/*
  {
    message: 'Success',
    error: false,
    data: [1, 2],
    total: 5,
    page: 1,
    pageSize: 2,
    totalPages: 3,
    hasNext: true,
    hasPrevious: false,
    timestamp: '2023-10-05T12:00:00Z',
    requestId: 'a2ef4c8d-1234-5678-90ab-cdef12345678'
  }
*/
app.get('/items', (req, res) => {
  const allItems = [1, 2, 3, 4, 5]; // fetched all items
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 2;

  const pagedResponse = createPaginatedResponse(allItems, page, pageSize, 'Items fetched');
  res.status(200).json(pagedResponse);
});
```

---

### `sendResponse()`

Adapter to convert API responses to Express.js response format.

**Method Signature:**

```ts
function sendResponse(res: Response, apiResponse: SuccessResponse<any> | ErrorResponse | RedirectResponse): void;
```

**Parameters:**

- `res`: The Express response object.
- `apiResponse`: The API response object (SuccessResponse, ErrorResponse, PaginatedResponse, NoContentResponse, or RedirectResponse).

**Example:**

```ts
import { sendResponse } from '@catbee/utils/response';

app.get('/item', (req, res) => {
  const item = getItemFromDatabase(req.params.id);
  if (!item) {
    return sendResponse(res, createErrorResponse('Item not found', 404));
  }
  sendResponse(res, createSuccessResponse(item, 'Item fetched'));
});
```
