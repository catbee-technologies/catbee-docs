---
slug: ../url
---

# URL

Helpers for parsing and manipulating URLs. Includes functions for appending and extracting query parameters, validating URLs, joining and normalizing paths, building URLs, and parsing typed query params. All methods are fully typed.

## API Summary

### Classes

- [**`UrlBuilder`**](#urlbuilder) - Fluent URL builder class for constructing and manipulating URLs.

### Functions

- [**`appendQueryParams(url, params): string`**](#appendqueryparams) - Appends query parameters to a URL.
- [**`parseQueryString(query): Record<string, string>`**](#parsequerystring) - Parses a query string into a key-value object.
- [**`isValidUrl(url, requireHttps = false): boolean`**](#isvalidurl) - Checks if a string is a valid URL, optionally requiring HTTPS.
- [**`getDomain(url, removeSubdomains = false): string`**](#getdomain) - Extracts the domain name from a URL, optionally removing subdomains.
- [**`joinPaths(...segments): string`**](#joinpaths) - Joins URL path segments, handling slashes.
- [**`normalizeUrl(url, base?): string`**](#normalizeurl) - Normalizes a URL by resolving relative paths and protocol.
- [**`updateQueryParam(url, key, value): string`**](#updatequeryparam) - Updates or sets a single query parameter in a URL.
- [**`createUrlBuilder(baseUrl): Object`**](#createurlbuilder) - Creates a URL builder for constructing URLs with a base URL.
- [**`extractQueryParams(url, paramNames): Record<string, string>`**](#extractqueryparams) - Extracts specific query parameters from a URL.
- [**`removeQueryParams(url, paramsToRemove): string`**](#removequeryparams) - Removes specified query parameters from a URL.
- [**`getExtension(url): string`**](#getextension) - Gets the file extension from a URL path.
- [**`parseTypedQueryParams<T>(url, converters?): Partial<T>`**](#parsetypedqueryparams) - Parses URL query parameters into a strongly-typed object.
- [**`getSubdomain(url): string`**](#getsubdomain) - Extracts the subdomain from a URL.
- [**`isRelativeUrl(url): boolean`**](#isrelativeurl) - Checks if a URL is relative (not absolute).
- [**`toAbsoluteUrl(relativeUrl, baseUrl): string`**](#toabsoluteurl) - Converts a relative URL to an absolute URL using a base URL.
- [**`sanitizeUrl(url, allowedProtocols = ['http', 'https']): string | null`**](#sanitizeurl) - Sanitizes a URL by removing dangerous protocols and normalizing.

---

## Class Documentation

### `UrlBuilder`

Fluent URL builder class for constructing and manipulating URLs. All methods return a new instance, making it immutable.

**Class Overview:**

```ts
class UrlBuilder {
  constructor(baseUrl?: string);
  static from(url: string): UrlBuilder;
  static http(host: string, path?: string): UrlBuilder;
  static https(host: string, path?: string): UrlBuilder;

  clone(): UrlBuilder;

  // Protocol Methods
  protocol(protocol: string): UrlBuilder;
  http(): UrlBuilder;
  https(): UrlBuilder;

  // Host/Domain Methods
  host(hostname: string): UrlBuilder;
  hostname(hostname: string): UrlBuilder;
  port(port: number | string): UrlBuilder;
  removePort(): UrlBuilder;
  subdomain(subdomain: string): UrlBuilder;

  // Path Methods
  path(path: string): UrlBuilder;
  appendPath(...segments: string[]): UrlBuilder;
  prependPath(...segments: string[]): UrlBuilder;
  replacePathSegment(index: number, segment: string): UrlBuilder;

  // Query Parameter Methods
  queryParam(key: string, value: string | number | boolean | null | undefined): UrlBuilder;
  addQueryParams(params: Record<string, string | number | boolean | null | undefined>): UrlBuilder;
  setQueryParams(params: Record<string, string | number | boolean>): UrlBuilder;
  removeQueryParam(key: string): UrlBuilder;
  removeQueryParams(keys: string[]): UrlBuilder;
  clearQueryParams(): UrlBuilder;
  appendQueryParam(key: string, value: string | number): UrlBuilder;

  // Hash/Fragment Methods
  hash(hash: string): UrlBuilder;
  removeHash(): UrlBuilder;

  // Username/Password Methods
  username(username: string): UrlBuilder;
  password(password: string): UrlBuilder;
  auth(username: string, password: string): UrlBuilder;
  removeAuth(): UrlBuilder;

  // Getter Methods
  getProtocol(): string;
  getHost(): string;
  getHostname(): string;
  getPort(): string;
  getPath(): string;
  getPathSegments(): string[];
  getQueryParam(key: string): string | null;
  getQueryParams(): Record<string, string>;
  getQueryParamAll(key: string): string[];
  getHash(): string;
  getSearch(): string;
  getOrigin(): string;
  getUsername(): string;
  getPassword(): string;

  // Validation Methods
  isValid(): boolean;
  isHttps(): boolean;
  isHttp(): boolean;
  hasQueryParam(key: string): boolean;
  hasHash(): boolean;
  hasAuth(): boolean;

  // Transformation Methods
  normalize(): UrlBuilder;
  sanitize(allowedProtocols?: string[]): UrlBuilder | null;
  lowercaseHost(): UrlBuilder;

  // Conversion Methods
  build(): string;
  toString(): string;
  toURL(): URL;
  toJSON(): string;
  href(): string;
  toObject(): {
    protocol: string;
    hostname: string;
    port: string;
    pathname: string;
    search: string;
    hash: string;
    username: string;
    password: string;
    origin: string;
    href: string;
    queryParams: Record<string, string>;
  };
}
```

**Examples:**

```ts
import { UrlBuilder } from '@catbee/utils/url';

// Build from scratch
const url = new UrlBuilder()
  .protocol('https')
  .host('api.example.com')
  .path('/users')
  .queryParam('page', 1)
  .queryParam('limit', 10)
  .build();
// -> 'https://api.example.com/users?page=1&limit=10'

// Modify existing URL
const modified = UrlBuilder.from('https://example.com/old')
  .path('/new')
  .addQueryParams({ active: true, sort: 'name' })
  .toString();
// -> 'https://example.com/new?active=true&sort=name'

// Use static factory methods
const apiUrl = UrlBuilder.https('api.example.com', '/v1/users').build();
const httpUrl = UrlBuilder.http('localhost', '/api').port(3000).build();

// Chain operations
const api = new UrlBuilder()
  .https()
  .host('api.example.com')
  .appendPath('v1', 'users', '123')
  .hash('profile')
  .build();
// -> 'https://api.example.com/v1/users/123#profile'

// Work with query parameters
const searchUrl = new UrlBuilder('https://example.com/search')
  .queryParam('q', 'typescript')
  .queryParam('lang', 'en')
  .queryParam('page', 1)
  .build();
// -> 'https://example.com/search?q=typescript&lang=en&page=1'

// Modify paths dynamically
const resourceUrl = UrlBuilder.from('https://api.example.com/v1')
  .appendPath('users', 'john', 'posts')
  .queryParam('status', 'published')
  .build();
// -> 'https://api.example.com/v1/users/john/posts?status=published'

// Handle authentication
const authUrl = new UrlBuilder('https://example.com')
  .auth('user', 'pass123')
  .path('/secure')
  .build();
// -> 'https://user:pass123@example.com/secure'

// Use getters to inspect URL components
const builder = UrlBuilder.from('https://api.example.com:8080/users?page=1#top');
console.log(builder.getProtocol()); // 'https:'
console.log(builder.getHost()); // 'api.example.com'
console.log(builder.getPort()); // '8080'
console.log(builder.getPath()); // '/users'
console.log(builder.getQueryParams()); // { page: '1' }
console.log(builder.getHash()); // '#top'

// Validation
const url1 = new UrlBuilder('https://example.com');
console.log(url1.isValid()); // true
console.log(url1.isHttps()); // true
console.log(url1.hasQueryParam('page')); // false

// Complex URL manipulation
const complexUrl = new UrlBuilder()
  .https()
  .subdomain('api')
  .host('example.com')
  .port(443)
  .appendPath('v2', 'products')
  .addQueryParams({
    category: 'electronics',
    sort: 'price',
    order: 'asc'
  })
  .hash('filters')
  .build();
// -> 'https://api.example.com:443/v2/products?category=electronics&sort=price&order=asc#filters'

// Export as object
const urlObj = UrlBuilder.from('https://api.example.com/users?active=true').toObject();
/*
{
  protocol: 'https:',
  hostname: 'api.example.com',
  port: '',
  pathname: '/users',
  search: '?active=true',
  hash: '',
  username: '',
  password: '',
  origin: 'https://api.example.com',
  href: 'https://api.example.com/users?active=true',
  queryParams: { active: 'true' }
}
*/
```

---

## Function Documentation & Usage Examples

### `appendQueryParams()`

Appends query parameters to a given URL.

**Method Signature:**

```ts
function appendQueryParams(url: string, params: Record<string, string | number>): string;
```

**Parameters:**

- `url`: The base URL to which query parameters will be appended.
- `params`: An object representing the query parameters to append.

**Returns:**

- The URL with appended query parameters.

**Example:**

```ts
import { appendQueryParams } from '@catbee/utils/url';

appendQueryParams('https://example.com', { page: 1, limit: 10 });
// → 'https://example.com/?page=1&limit=10'
```

---

### `parseQueryString()`

Parses a query string into a key-value object.

**Method Signature:**

```ts
function parseQueryString(query: string): Record<string, string>;
```

**Parameters:**

- `query`: The query string to parse.

**Returns:**

- A key-value object representing the parsed query parameters.

**Example:**

```ts
import { parseQueryString } from '@catbee/utils/url';

parseQueryString('?page=1&limit=10');
// → { page: '1', limit: '10' }
```

---

### `isValidUrl()`

Validates if a string is a valid URL, optionally requiring HTTPS.

**Method Signature:**

```ts
function isValidUrl(url: string, requireHttps: boolean = false): boolean;
```

**Parameters:**

- `url`: The URL string to validate.
- `requireHttps`: Whether to require HTTPS (default: false).

**Returns:**

- `true` if the URL is valid, `false` otherwise.

**Example:**

```ts
import { isValidUrl } from '@catbee/utils/url';

isValidUrl('https://example.com'); // true
isValidUrl('ftp://example.com'); // false (if requireHttps is true)
```

---

### `getDomain()`

Extracts the domain name from a URL, optionally removing subdomains.

**Method Signature:**

```ts
function getDomain(url: string, removeSubdomains: boolean = false): string;
```

**Parameters:**

- `url`: The URL to extract the domain from.
- `removeSubdomains`: Whether to remove subdomains (default: false).

**Returns:**

- The domain name.

**Example:**

```ts
import { getDomain } from '@catbee/utils/url';

getDomain('https://api.example.com/path'); // 'api.example.com'
getDomain('https://api.example.com/path', true); // 'example.com'
```

---

### `joinPaths()`

Joins URL path segments, handling slashes.

**Method Signature:**

```ts
function joinPaths(...segments: string[]): string;
```

**Parameters:**

- `...segments`: The URL path segments to join.

**Returns:**

- The joined URL path.

**Example:**

```ts
import { joinPaths } from '@catbee/utils/url';

joinPaths('https://example.com/', '/api/', '/users');
// → 'https://example.com/api/users'
```

---

### `normalizeUrl()`

Normalizes a URL by resolving relative paths and protocol.

**Method Signature:**

```ts
function normalizeUrl(url: string, base?: string): string;
```

**Parameters:**

- `url`: The URL to normalize.
- `base`: An optional base URL to resolve relative URLs against.

**Returns:**

- The normalized URL.

**Example:**

```ts
import { normalizeUrl } from '@catbee/utils/url';

normalizeUrl('HTTP://Example.COM/foo/../bar');
// → 'http://example.com/bar'
```

---

### `updateQueryParam()`

Updates or sets a single query parameter in a URL.

**Method Signature:**

```ts
function updateQueryParam(url: string, key: string, value: string | number): string;
```

**Parameters:**

- `url`: The source URL.
- `key`: Parameter key.
- `value`: Parameter value.

**Returns:**

- The URL with updated parameter.

**Example:**

```ts
import { updateQueryParam } from '@catbee/utils/url';

updateQueryParam('https://example.com?page=1', 'page', 2);
// → 'https://example.com?page=2'
```

---

### `createUrlBuilder()`

Creates a URL builder for constructing URLs with a base URL.

**Method Signature:**

```ts
function createUrlBuilder(baseUrl: string): {
  path(path: string, params?: Record<string, any>): string;
  query(params: Record<string, any>): string;
};
```

**Parameters:**

- `baseUrl`: The base URL for the builder.

**Returns:**

- An object with methods:
  - `path(path, params?)`: Creates a full URL with the given path and optional query parameters.
  - `query(params)`: Creates a full URL with query parameters but no additional path.

**Example:**

```ts
import { createUrlBuilder } from '@catbee/utils/url';

const api = createUrlBuilder('https://api.example.com');

api.path('/users', { active: true });
// → 'https://api.example.com/users?active=true'

api.query({ version: 'v1' });
// → 'https://api.example.com?version=v1'
```

---

### `extractQueryParams()`

Extracts specific query parameters from a URL.

**Method Signature:**

```ts
function extractQueryParams(url: string, paramNames: string[]): Record<string, string>;
```

**Parameters:**

- `url`: The URL to extract query parameters from.
- `paramNames`: An array of parameter names to extract.

**Returns:**

- An object containing the extracted query parameters.

**Example:**

```ts
import { extractQueryParams } from '@catbee/utils/url';

extractQueryParams('https://example.com?page=1&limit=10', ['page']);
// → { page: '1' }
```

---

### `removeQueryParams()`

Removes specified query parameters from a URL.

**Method Signature:**

```ts
function removeQueryParams(url: string, paramsToRemove: string[]): string;
```

**Parameters:**

- `url`: The URL to remove query parameters from.
- `paramsToRemove`: An array of parameter names to remove.

**Returns:**

- The modified URL without the specified query parameters.

**Example:**

```ts
removeQueryParams('https://example.com?page=1&limit=10', ['limit']);
// → 'https://example.com/?page=1'
```

---

### `getExtension()`

Gets the file extension from a URL path.

**Method Signature:**

```ts
function getExtension(url: string): string;
```

**Parameters:**

- `url`: The URL to extract the file extension from.

**Returns:**

- The file extension (without the dot), or an empty string if none exists.

**Example:**

```ts
import { getExtension } from '@catbee/utils/url';

getExtension('https://example.com/document.pdf?v=1');
// → 'pdf'
```

---

### `parseTypedQueryParams()`

Parses URL query parameters into a strongly-typed object.

**Method Signature:**

```ts
function parseTypedQueryParams<T extends Record<string, any>>(
  url: string,
  converters?: Record<keyof T, (val: string) => any>
): Partial<T>;
```

**Parameters:**

- `url`: The URL to parse.
- `converters`: An optional object mapping parameter names to conversion functions.

**Returns:**

- A partially-typed object containing the parsed query parameters.

**Example:**

```ts
import { parseTypedQueryParams } from '@catbee/utils/url';

parseTypedQueryParams<{ page: number; q: string }>('https://example.com?page=2&q=test', {
  page: Number,
  q: String
});
// → { page: 2, q: 'test' }
```

---

### `getSubdomain()`

Extracts the subdomain from a URL.

**Method Signature:**

```ts
function getSubdomain(url: string): string;
```

**Parameters:**

- `url`: The URL to extract the subdomain from.

**Returns:**

- The subdomain or empty string if none exists.

**Example:**

```ts
import { getSubdomain } from '@catbee/utils/url';

getSubdomain('https://api.example.com'); // 'api'
getSubdomain('https://www.blog.example.com'); // 'www.blog'
getSubdomain('https://example.com'); // ''
```

---

### `isRelativeUrl()`

Checks if a URL is relative (not absolute).

**Method Signature:**

```ts
function isRelativeUrl(url: string): boolean;
```

**Parameters:**

- `url`: The URL to check.

**Returns:**

- `true` if the URL is relative, otherwise `false`.

**Example:**

```ts
import { isRelativeUrl } from '@catbee/utils/url';

isRelativeUrl('/path/to/page'); // true
isRelativeUrl('./relative'); // true
isRelativeUrl('../parent'); // true
isRelativeUrl('https://example.com/page'); // false
```

---

### `toAbsoluteUrl()`

Converts a relative URL to an absolute URL using a base URL.

**Method Signature:**

```ts
function toAbsoluteUrl(relativeUrl: string, baseUrl: string): string;
```

**Parameters:**

- `relativeUrl`: The relative URL to convert.
- `baseUrl`: The base URL to resolve against.

**Returns:**

- The absolute URL.

**Example:**

```ts
import { toAbsoluteUrl } from '@catbee/utils/url';

toAbsoluteUrl('/api/users', 'https://example.com');
// → 'https://example.com/api/users'

toAbsoluteUrl('../parent', 'https://example.com/path/to/page');
// → 'https://example.com/path/parent'
```

---

### `sanitizeUrl()`

Sanitizes a URL by removing dangerous protocols and normalizing.

**Method Signature:**

```ts
function sanitizeUrl(url: string, allowedProtocols: string[] = ['http', 'https']): string | null;
```

**Parameters:**

- `url`: The URL to sanitize.
- `allowedProtocols`: Array of allowed protocols (default: `['http', 'https']`).

**Returns:**

- The sanitized URL or `null` if the URL uses a disallowed protocol.

**Example:**

```ts
import { sanitizeUrl } from '@catbee/utils/url';

sanitizeUrl('javascript:alert(1)'); // null (dangerous protocol)
sanitizeUrl('https://example.com'); // 'https://example.com/'
sanitizeUrl('ftp://example.com', ['ftp', 'http', 'https']); // 'ftp://example.com/'
```
