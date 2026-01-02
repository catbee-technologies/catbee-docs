---
slug: ../fs
---

# File System

A comprehensive set of utilities for common file system operations including reading, writing, and manipulating files and directories. These utilities provide promise-based wrappers around Node.js fs operations with proper error handling and simplified interfaces.

## API Summary

- [**`fileExists(path: string): Promise<boolean>`**](#fileexists) - Checks if a file or directory exists.
- [**`readJsonFile<T>(path: string): Promise<T | null>`**](#readjsonfile) - Reads and parses a JSON file.
- [**`readJsonOrDefault<T>(path: string, defaultValue: T): Promise<T>`**](#readjsonordefault) - Reads a JSON file or returns a default value on error.
- [**`writeJsonFile(path: string, data: any, space = 2): Promise<void>`**](#writejsonfile) - Writes an object to a file as JSON.
- [**`deleteFileIfExists(path: string): Promise<boolean>`**](#deletefileifexists) - Deletes a file if it exists.
- [**`readFile(path: string, encoding = 'utf-8'): Promise<string>`**](#readfile) - Reads a file asynchronously.
- [**`readFileSync(path: string, encoding = 'utf-8'): string`**](#readfilesync) - Reads a file synchronously.
- [**`safeReadFile(path: string, encoding = 'utf-8'): Promise<{ data: string | null; error: Error | null }>`**](#safereadfile) - Safely reads a file with error handling.
- [**`safeReadFileSync(path: string, encoding = 'utf-8'): { data: string | null; error: Error | null }`**](#safereadfilesync) - Safely reads a file synchronously with error handling.
- [**`writeFile(path: string, content: string, encoding = 'utf-8'): Promise<boolean>`**](#writefile) - Writes text content to a file.
- [**`appendFile(path: string, content: string, encoding = 'utf-8'): Promise<boolean>`**](#appendfile) - Appends text content to a file.
- [**`copyFile(source: string, destination: string, overwrite = false): Promise<boolean>`**](#copyfile) - Copies a file.
- [**`moveFile(oldPath: string, newPath: string): Promise<boolean>`**](#movefile) - Moves a file.
- [**`getFileStats(path: string): Promise<fs.Stats | null>`**](#getfilestats) - Gets file stats if the file exists.
- [**`createTempFile(options?): Promise<string>`**](#createtempfile) - Creates a temporary file with optional content.
- [**`streamFile(source: string, destination: string): Promise<void>`**](#streamfile) - Streams a file from source to destination.
- [**`readDirectory(dirPath: string, options?): Promise<string[]>`**](#readdirectory) - Reads a directory and returns file names.
- [**`createDirectory(dirPath: string, recursive = true): Promise<boolean>`**](#createdirectory) - Creates a directory if it doesn't exist.
- [**`safeReadJsonFile<T>(path: string): Promise<{ data: T | null; error: Error | null }>`**](#safereadjsonfile) - Safely reads and parses a JSON file with error details.
- [**`isFile(path: string): Promise<boolean>`**](#isfile) - Checks if a path points to a file (not a directory).
- [**`getFileSize(path: string): Promise<number>`**](#getfilesize) - Gets the size of a file in bytes.
- [**`readFileBuffer(path: string): Promise<Buffer | null>`**](#readfilebuffer) - Reads a file as a Buffer.

---

## Function Documentation & Usage Examples

### `fileExists`

Checks whether a file or directory exists at the given path.

**Method Signature:**

```ts
async function fileExists(path: string): Promise<boolean>;
```

**Parameters:**

- `path` (string): The path to the file or directory.

**Returns:**

- `Promise<boolean>`: Resolves to true if the file or directory exists, false otherwise.

**Example:**

```ts
import { fileExists } from '@catbee/utils/fs';

if (await fileExists('./config.json')) {
  console.log('Configuration file exists');
}
```

---

### `readJsonFile`

Reads and parses a JSON file from the specified path.

**Method Signature:**

```ts
async function readJsonFile<T = any>(path: string): Promise<T | null>;
```

**Parameters:**

- `path` (string): The path to the JSON file.

**Returns:**

- `Promise<T | null>`: Resolves to the parsed JSON object or null if the file doesn't exist or parsing fails.

**Example:**

```ts
import { readJsonFile } from '@catbee/utils/fs';

interface Config {
  apiKey: string;
  endpoint: string;
}

const config = await readJsonFile<Config>('./config.json');
if (config) {
  console.log(`Using API at ${config.endpoint}`);
}
```

---

### `readJsonOrDefault`

Reads and parses a JSON file, returning a default value if reading or parsing fails.

**Method Signature:**

```ts
async function readJsonOrDefault<T = any>(path: string, defaultValue: T): Promise<T>;
```

**Parameters:**

- `path` (string): The path to the JSON file.
- `defaultValue` (T): The value to return if the file doesn't exist or parsing fails.

**Returns:**

- `Promise<T>`: Resolves to the parsed JSON object or the default value.

**Example:**

```ts
import { readJsonOrDefault } from '@catbee/utils/fs';

const config = await readJsonOrDefault('./config.json', { debug: false, port: 3000 });
console.log(`Server will run on port ${config.port}`);
```

---

### `writeJsonFile`

Writes a JavaScript object to a file as formatted JSON.

**Method Signature:**

```ts
async function writeJsonFile(path: string, data: any, space = 2): Promise<void>;
```

**Parameters:**

- `path` (string): The path to the file where JSON should be written.
- `data` (any): The JavaScript object to serialize as JSON.
- `space` (number, optional): Number of spaces for indentation in the JSON file (default: 2).

**Returns:**

- `Promise<void>`: Resolves when the file has been written.

**Example:**

```ts
import { writeJsonFile } from '@catbee/utils/fs';

const data = {
  name: 'Project',
  version: '1.0.0',
  dependencies: []
};

await writeJsonFile('./package.json', data, 2);
```

---

### `deleteFileIfExists`

Deletes a file if it exists.

**Method Signature:**

```ts
async function deleteFileIfExists(path: string): Promise<boolean>;
```

**Parameters:**

- `path` (string): The path to the file to delete.

**Returns:**

- `Promise<boolean>`: Resolves to true if the file was deleted or didn't exist, false if deletion failed.

**Example:**

```ts
import { deleteFileIfExists } from '@catbee/utils/fs';

const deleted = await deleteFileIfExists('./temp.log');
console.log(deleted ? "File deleted or didn't exist" : 'Deletion failed');
```

---

### `readFile`

Reads a file from the specified path asynchronously.

**Method Signature:**

```ts
async function readFile(path: string, encoding: BufferEncoding = 'utf-8'): Promise<string>;
```

**Parameters:**

- `path` (string): The path to the file.
- `encoding` (BufferEncoding, optional): The text encoding to use (default: 'utf-8').

**Returns:**

- `Promise<string>`: Resolves to the file content as a string.

**Throws:**

- An error if the file doesn't exist or reading fails.

**Example:**

```ts
import { readFile } from '@catbee/utils/fs';

const content = await readFile('./README.md');
console.log('File content:', content.substring(0, 100) + '...');
```

---

### `readFileSync`

Reads a file from the specified path synchronously.

**Method Signature:**

```ts
function readFileSync(path: string, encoding: BufferEncoding = 'utf-8'): string;
```

**Parameters:**

- `path` (string): The path to the file.
- `encoding` (BufferEncoding, optional): The text encoding to use (default: 'utf-8').

**Returns:**

- `string`: The file content as a string.

**Throws:**

- An error if the file doesn't exist or reading fails.

**Example:**

```ts
import { readFileSync } from '@catbee/utils/fs';

const content = readFileSync('./config.json');
```

---

### `safeReadFile`

Safely reads a file and returns its content along with any error encountered.

**Method Signature:**

```ts
async function safeReadFile(path: string, encoding: BufferEncoding = 'utf-8'): Promise<{ data: string | null; error: Error | null }>;
```

**Parameters:**

- `path` (string): The path to the file.
- `encoding` (BufferEncoding, optional): The text encoding to use (default: 'utf-8').

**Returns:**

- `Promise<{ data: string | null; error: Error | null }>`: Object containing:
  - `data`: The file content as a string, or null if reading failed.
  - `error`: An error object if reading failed, or null if successful.

**Example:**

```ts
import { safeReadFile } from '@catbee/utils/fs';

const { data, error } = await safeReadFile('./config.txt');
if (error) {
  console.error('Error reading file:', error.message);
} else {
  console.log('File content:', data);
}
```

---

### `safeReadFileSync`

Safely reads a file synchronously and returns its content along with any error encountered.

**Method Signature:**

```ts
function safeReadFileSync(path: string, encoding: BufferEncoding = 'utf-8'): { data: string | null; error: Error | null };
```

**Parameters:**

- `path` (string): The path to the file.
- `encoding` (BufferEncoding, optional): The text encoding to use (default: 'utf-8').

**Returns:**

- `{ data: string | null; error: Error | null }`: Object containing:
  - `data`: The file content as a string, or null if reading failed.
  - `error`: An error object if reading failed, or null if successful.

**Example:**

```ts
import { safeReadFileSync } from '@catbee/utils/fs';

const { data, error } = safeReadFileSync('./config.txt');
if (error) {
  console.error('Error reading file:', error.message);
} else {
  console.log('File content:', data);
}
```

---

### `writeFile`

Writes text content to a file.

**Method Signature:**

```ts
async function writeFile(path: string, content: string, encoding: BufferEncoding = 'utf-8'): Promise<boolean>;
```

**Parameters:**

- `path` (string): The path to the file where text should be written.
- `content` (string): The text content to write to the file.
- `encoding` (BufferEncoding, optional): The text encoding to use (default: 'utf-8').

**Returns:**

- `Promise<boolean>`: Resolves to true if the file was written successfully, false otherwise.

**Example:**

```ts
import { writeFile } from '@catbee/utils/fs';

const success = await writeFile('./log.txt', 'Application started');
if (success) {
  console.log('Log entry written');
}
```

---

### `appendFile`

Appends text content to a file.

**Method Signature:**

```ts
async function appendFile(path: string, content: string, encoding: BufferEncoding = 'utf-8'): Promise<boolean>;
```

**Parameters:**

- `path` (string): The path to the file where text should be appended.
- `content` (string): The text content to append to the file.
- `encoding` (BufferEncoding, optional): The text encoding to use (default: 'utf-8').

**Returns:**

- `Promise<boolean>`: Resolves to true if the content was appended successfully, false otherwise.

**Example:**

```ts
import { appendFile } from '@catbee/utils/fs';

const success = await appendFile('./log.txt', '\nNew log entry at ' + new Date().toISOString());
if (success) {
  console.log('Log entry appended');
}
```

---

### `copyFile`

Copies a file from source to destination.

**Method Signature:**

```ts
async function copyFile(source: string, destination: string, overwrite = false): Promise<boolean>;
```

**Parameters:**

- `source` (string): The path to the source file.
- `destination` (string): The path to the destination file.
- `overwrite` (boolean, optional): Whether to overwrite the destination file if it exists (default: false).

**Returns:**

- `Promise<boolean>`: Resolves to true if the file was copied successfully, false otherwise.

**Example:**

```ts
import { copyFile } from '@catbee/utils/fs';

const copied = await copyFile('./original.txt', './backup.txt', true);
console.log(copied ? 'File copied successfully' : 'Copy failed');
```

---

### `moveFile`

Renames/moves a file.

**Method Signature:**

```ts
async function moveFile(oldPath: string, newPath: string): Promise<boolean>;
```

**Parameters:**

- `oldPath` (string): The current path of the file.
- `newPath` (string): The new path for the file.

**Returns:**

- `Promise<boolean>`: Resolves to true if the file was moved successfully, false otherwise.

**Example:**

```ts
import { moveFile } from '@catbee/utils/fs';

const moved = await moveFile('./temp.txt', './processed/temp.txt');
console.log(moved ? 'File moved successfully' : 'Move failed');
```

---

### `getFileStats`

Gets file stats if the file exists.

**Method Signature:**

```ts
async function getFileStats(path: string): Promise<Stats | null>;
```

**Parameters:**

- `path` (string): The path to the file.

**Returns:**

- `Promise<Stats | null>`: Resolves to the file stats object if the file exists, or null if it doesn't.
  - `Stats` is the Node.js fs.Stats object containing file metadata.

**Example:**

```ts
import { getFileStats } from '@catbee/utils/fs';

const stats = await getFileStats('./document.pdf');
if (stats) {
  console.log(`File size: ${stats.size} bytes`);
  console.log(`Last modified: ${stats.mtime}`);
}
```

---

### `createTempFile`

Creates a temporary file with optional content.

**Method Signature:**

```ts
interface TempFileOptions {
  prefix?: string;     // default: 'tmp-'
  extension?: string;  // default: ''
  dir?: string;        // default: os.tmpdir()
  content?: string | Buffer;
}

async function createTempFile(options?: TempFileOptions): Promise<string>;
```

**Parameters:**

- `options` (TempFileOptions, optional): Configuration options for the temporary file.
  - `prefix` (string, optional): Prefix for the temp file name (default: 'tmp-').
  - `extension` (string, optional): File extension (e.g., '.txt') (default: '').
  - `dir` (string, optional): Directory to create the temp file in (default: system temp directory).
  - `content` (string | Buffer, optional): Initial content to write to the temp file.

**Returns:**

- `Promise<string>`: Resolves to the path of the created temporary file.

**Example:**

```ts
import { createTempFile } from '@catbee/utils/fs';

const tempPath = await createTempFile({
  prefix: 'upload-',
  extension: '.json',
  content: JSON.stringify({ status: 'processing' })
});
console.log(`Created temporary file at: ${tempPath}`);
```

---

### `streamFile`

Streams a file from source to destination.

**Method Signature:**

```ts
async function streamFile(source: string, destination: string): Promise<void>;
```

**Parameters:**

- `source` (string): The path to the source file.
- `destination` (string): The path to the destination file.

**Returns:**

- `Promise<void>`: Resolves when the streaming is complete.

**Example:**

```ts
import { streamFile } from '@catbee/utils/fs';

try {
  await streamFile('./largefile.mp4', './backup/largefile.mp4');
  console.log('File streamed successfully');
} catch (error) {
  console.error('Streaming failed:', error);
}
```

---

### `readDirectory`

Reads a directory and returns file names.

**Method Signature:**

```ts
interface ReadDirectoryOptions {
  fullPaths?: boolean;
  filter?: RegExp;
}

async function readDirectory(dirPath: string, options?: ReadDirectoryOptions): Promise<string[]>;
```

**Parameters:**

- `dirPath` (string): The path to the directory to read.
- `options` (ReadDirectoryOptions, optional): Options for reading the directory.
  - `fullPaths` (boolean, optional): If true, returns full paths instead of just file names. Defaults to false.
  - `filter` (RegExp, optional): A regular expression to filter file names.

**Returns:**

- `Promise<string[]>`: Resolves to an array of file names or paths in the directory.

**Throws:**

- An error if the directory cannot be read.

**Example:**

```ts
import { readDirectory } from '@catbee/utils/fs';

// Get all JavaScript files with full paths
const jsFiles = await readDirectory('./src', {
  fullPaths: true,
  filter: /\.js$/
});
console.log(`Found ${jsFiles.length} JavaScript files`);
```

---

### `createDirectory`

Creates a directory if it doesn't exist.

**Method Signature:**

```ts
async function createDirectory(dirPath: string, recursive = true): Promise<boolean>;
```

**Parameters:**

- `dirPath` (string): The path of the directory to create.
- `recursive` (boolean, optional): If true, creates parent directories as needed (default: true).

**Returns:**

- `Promise<boolean>`: Resolves to true if the directory was created or already exists, false if creation failed.

**Example:**

```ts
import { createDirectory } from '@catbee/utils/fs';

const created = await createDirectory('./uploads/images', true);
if (created) {
  console.log('Directory created successfully');
}
```

---

### `safeReadJsonFile`

Safely reads and parses a JSON file with error details.

**Method Signature:**

```ts
async function safeReadJsonFile<T = any>(path: string): Promise<{ data: T | null; error: Error | null }>;
```

**Parameters:**

- `path` (string): The path to the JSON file.

**Returns:**

- `Promise<{ data: T | null; error: Error | null }>`: Resolves to an object containing:
  - `data` (T | null): The parsed JSON object, or null if reading/parsing failed.
  - `error` (Error | null): An error object if an error occurred, or null if successful.

**Example:**

```ts
import { safeReadJsonFile } from '@catbee/utils/fs';

const { data, error } = await safeReadJsonFile('./config.json');
if (error) {
  console.error('Error reading config:', error.message);
} else {
  console.log('Config loaded:', data);
}
```

---

### `isFile`

Checks if a path points to a file (not a directory).

**Method Signature:**

```ts
async function isFile(path: string): Promise<boolean>;
```

**Parameters:**

- `path` (string): The path to check.

**Returns:**

- `Promise<boolean>`: Resolves to true if the path points to a file, false if it points to a directory or doesn't exist.

**Example:**

```ts
import { isFile } from '@catbee/utils/fs';

if (await isFile('./path/to/item')) {
  console.log('This is a file');
} else {
  console.log("This is not a file or doesn't exist");
}
```

---

### `getFileSize`

Gets the size of a file in bytes.

**Method Signature:**

```ts
async function getFileSize(path: string): Promise<number>;
```

**Parameters:**

- `path` (string): The path to the file.

**Returns:**

- `Promise<number>`: Resolves to the file size in bytes, or -1 if the file doesn't exist.

**Example:**

```ts
import { getFileSize } from '@catbee/utils/fs';

const size = await getFileSize('./document.pdf');
if (size >= 0) {
  console.log(`File size: ${size} bytes`);
} else {
  console.log('File not found');
}
```

---

### `readFileBuffer`

Reads a file as a Buffer.

**Method Signature:**

```ts
async function readFileBuffer(path: string): Promise<Buffer | null>;
```

**Parameters:**

- `path` (string): The path to the file.

**Returns:**

- `Promise<Buffer | null>`: Resolves to a Buffer containing the file data, or null if the file doesn't exist or reading fails.

**Example:**

```ts
import { readFileBuffer } from '@catbee/utils/fs';

const buffer = await readFileBuffer('./image.png');
if (buffer) {
  console.log(`Read ${buffer.length} bytes`);
}
```
