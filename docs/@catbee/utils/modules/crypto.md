---
slug: ../crypto
---

# Crypto

Secure cryptographic functions for encryption, hashing, and token generation. Includes hashing, HMAC, random string and API key generation, timing-safe comparison, AES encryption/decryption, and JWT-like token creation/verification. All methods are fully typed.

## API Summary

- [**`hmac(algorithm: string, input: string, secret: string, encoding?: BinaryToTextEncoding): string`**](#hmac) - Generate an HMAC hash.
- [**`hash(algorithm: string, input: string, encoding?: BinaryToTextEncoding): string`**](#hash) - Generate a hash using a specified algorithm.
- [**`sha256Hmac(input: string, secret: string): string`**](#sha256hmac) - Generate a SHA256 HMAC.
- [**`sha1(input: string, encoding?: BinaryToTextEncoding): string`**](#sha1) - Generate a SHA1 hash.
- [**`sha256(input: string, encoding?: BinaryToTextEncoding): string`**](#sha256) - Generate a SHA256 hash.
- [**`md5(input: string): string`**](#md5) - Generate an MD5 hash.
- [**`randomString(): string`**](#randomstring) - Generate a cryptographically secure random string.
- [**`generateRandomBytes(byteLength?: number): Buffer`**](#generaterandombytes) - Generate random bytes.
- [**`generateRandomBytesAsString(byteLength?: number, encoding?: BinaryToTextEncoding): string`**](#generaterandombytesasstring) - Generate random bytes as a string.
- [**`generateApiKey(prefix?: string, byteLength?: number): string`**](#generateapikey) - Generate an API key with optional prefix.
- [**`safeCompare(a: string | Buffer | Uint8Array, b: string | Buffer | Uint8Array): boolean`**](#safecompare) - Timing-safe string comparison.
- [**`encrypt(data: string | Buffer, key: string | Buffer, options?): Promise<EncryptionResult>`**](#encrypt) - Encrypt data using AES.
- [**`decrypt(encryptedData: EncryptionResult, key: string | Buffer, options?): Promise<string | Buffer>`**](#decrypt) - Decrypt AES encrypted data.
- [**`createSignedToken(payload: object, secret: string, expiresInSeconds?: number): string`**](#createsignedtoken) - Create a signed token (JWT-like).
- [**`verifySignedToken(token: string, secret: string): object | null`**](#verifysignedtoken) - Verify and decode a signed token.
- [**`pbkdf2Hash(password: string, salt: string | Buffer, keyLength?: number, iterations?: number): Promise<Buffer>`**](#pbkdf2hash) - Derive a cryptographic key using PBKDF2.
- [**`generateNonce(byteLength?: number, encoding?: BinaryToTextEncoding): string`**](#generatenonce) - Generate a cryptographically secure nonce.
- [**`secureRandomInt(min: number, max: number): number`**](#securerandomint) - Generate a cryptographically secure random integer in a range.
- [**`hashPassword(password: string, saltLength?: number, keyLength?: number): Promise<string>`**](#hashpassword) - Hash a password using scrypt.
- [**`verifyPassword(password: string, hash: string): Promise<boolean>`**](#verifypassword) - Verify a password against a scrypt hash.
- [**`generateKeys(options: GenerateKeyOptions = {}): Promise<GenerateKeyResult>`**](#generatekeys) - Generate a public/private key pair.
- [**`sign(data: string | Buffer | Uint8Array, privateKeyCrypto: CryptoKey, options: SignatureOptions = {}): Promise<string>`**](#sign) - Sign data with a private key.
- [**`verify(data: string | Buffer | Uint8Array, signature: string | Buffer | Uint8Array, publicKeyCrypto: CryptoKey, options: VerifyOptions = {}): Promise<boolean>`**](#verify) - Verify a signature with a public key.
- [**`importKey(key: string | JsonWebKey, options: ImportKeyOptions = {}): Promise<CryptoKey>`**](#importkey) - Import a PEM or JWK assymetric key.
- [**`exportKey(key: CryptoKey, format: 'jwk' | 'pem' = 'jwk', options: ExportKeyOptions = {}): Promise<JsonWebKey | string>`**](#exportkey) - Export a key to PEM or JWK.
- [**`fingerprint(publicKey: CryptoKey, encoding: SignatureEncoding = 'base64url'): Promise<string>`**](#fingerprint) - Generate a fingerprint for a key.
- [**`getKeyId(publicKey: CryptoKey): Promise<string>`**](#getkeyid) - Generate a key ID for a key.

---

## Interfaces & Types

```ts
type BufferEncoding = 'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'utf-16le' | 'ucs2' | 'ucs-2' | 'base64' | 'base64url' | 'latin1' | 'binary' | 'hex';

interface EncryptionOptions {
  /** Algorithm to use (default: aes-256-gcm) */
  algorithm?: CipherGCMTypes;
  /** Input encoding for plaintext if string (default: utf8) */
  inputEncoding?: BufferEncoding;
  /** Output encoding for ciphertext (default: hex) */
  outputEncoding?: BinaryToTextEncoding;
}

interface DecryptionOptions {
  /** Algorithm to use (default: aes-256-gcm) */
  algorithm?: CipherGCMTypes;
  /** Input encoding for ciphertext if string (default: hex) */
  inputEncoding?: BinaryToTextEncoding;
  /** Output encoding for plaintext (default: utf8) */
  outputEncoding?: BufferEncoding;
}

interface EncryptionResult {
  /** Encrypted data (string or Buffer based on options) */
  ciphertext: string | Buffer;
  /** Initialization vector */
  iv: Buffer;
  /** Authentication tag (for GCM mode) */
  authTag?: Buffer;
  /** Algorithm used */
  algorithm: string;
  /** Salt used for key derivation */
  salt: Buffer;
}

/**
 * Supported asymmetric key types for generation.
 *
 * - `RSA`       → RSASSA-PKCS1-v1_5 (legacy compatibility)
 * - `RSA-PSS`   → Recommended RSA variant with modern padding
 * - `ECDSA`     → Elliptic Curve (fast, smaller keys)
 * - `Ed25519`   → Modern, simple, highly secure (recommended)
 */
type EncKeyType = 'RSA' | 'RSA-PSS' | 'ECDSA' | 'Ed25519';

/**
 * Options to configure key pair generation.
 */
export interface GenerateKeyOptions {
  /**
   * Type of key algorithm to generate.
   * @default 'RSA-PSS'
   */
  type?: EncKeyType;

  /**
   * RSA modulus length in bits.
   * Recommended: 2048 or 3072 (4096 for high security).
   * @default 2048
   */
  modulusLength?: number;

  /**
   * Hash algorithm used for signing.
   *
   * ⚠️ For ECDSA, hash is used during sign/verify, not key generation.
   * @default 'SHA-256'
   */
  hash?: 'SHA-256' | 'SHA-384' | 'SHA-512';

  /**
   * Named curve for ECDSA keys.
   * @default 'P-256'
   */
  namedCurve?: 'P-256' | 'P-384' | 'P-521';

  /**
   * Whether the private key can be exported.
   *
   * ⚠️ Set to `false` in production if you don't need to export keys.
   * @default false
   */
  extractable?: boolean;

  /**
   * Whether to include generated CryptoKey objects in the result.
   *
   * Useful when private key export is disabled (`extractable: false`) but
   * you still want to sign/verify with the in-memory keys.
   * @default false
   */
  includeCryptoKeys?: boolean;

  /**
   * Whether to format Base64 output into 64-character lines (PEM style).
   * @default true
   */
  formatPemLines?: boolean;

  /**
   * Whether to include PEM prefix/suffix headers.
   *
   * Example:
   * -----BEGIN PRIVATE KEY-----
   * -----END PRIVATE KEY-----
   *
   * @default true
   */
  addPrefixSuffix?: boolean;
}


interface GenerateKeyResult {
  /** Algorithm type used */
  type: EncKeyType;

  /** PEM or Base64 encoded private key (only when extractable is true) */
  privateKey?: string;

  /** PEM or Base64 encoded public key */
  publicKey: string;

  /** Raw PKCS8 private key buffer (only when extractable is true) */
  privateKeyBuffer?: ArrayBuffer;

  /** Raw SPKI public key buffer */
  publicKeyBuffer: ArrayBuffer;

  /** Optional generated private CryptoKey */
  privateKeyCrypto?: CryptoKey;

  /** Optional generated public CryptoKey */
  publicKeyCrypto?: CryptoKey;
}

interface ExportKeyOptions {
  /**
   * Whether to format Base64 output into 64-character lines (PEM style).
   * @default true
   */
  formatPemLines?: boolean;

  /**
   * Whether to include PEM prefix/suffix headers.
   * @default true
   */
  addPrefixSuffix?: boolean;
}
```

---

## Function Documentation & Usage Examples

### `hmac()`

Generate an HMAC hash.

**Method Signature:**

```ts
function hmac(algorithm: string, input: string, secret: string, encoding?: BinaryToTextEncoding): string;
```

**Parameters:**

- `algorithm`: The hash algorithm (e.g., 'sha256', 'sha1').
- `input`: The input string to hash.
- `secret`: The secret key for HMAC.
- `encoding`: Optional output encoding (e.g., 'hex', 'base64'). Default is 'hex'.

**Returns:**

- The resulting HMAC hash as a string.

**Examples:**

```ts
import { hmac } from '@catbee/utils/crypto';

hmac('sha256', 'data', 'secret'); // '...'/
```

---

### `hash()`

Generate a hash using a specified algorithm.

**Method Signature:**

```ts
function hash(algorithm: string, input: string, encoding?: BinaryToTextEncoding): string;
```

**Parameters:**

- `algorithm`: The hash algorithm (e.g., 'sha256', 'md5').
- `input`: The input string to hash.
- `encoding`: Optional output encoding (e.g., 'hex', 'base64'). Default is 'hex'.

**Returns:**

- The resulting hash as a string.

**Examples:**

```ts
import { hash } from '@catbee/utils/crypto';

hash('sha256', 'data'); // '...'
```

---

### `sha256Hmac()`

Generate a SHA256 HMAC.

**Method Signature:**

```ts
function sha256Hmac(input: string, secret: string): string;
```

**Parameters:**

- `input`: The input string to hash.
- `secret`: The secret key for HMAC.

**Returns:**

- The resulting HMAC hash as a string.

**Examples:**

```ts
import { sha256Hmac } from '@catbee/utils/crypto';

sha256Hmac('data', 'secret'); // '...'
```

---

### `sha1()`

Generate a SHA1 hash.

**Method Signature:**

```ts
function sha1(input: string, encoding?: BinaryToTextEncoding): string;
```

**Parameters:**

- `input`: The input string to hash.
- `encoding`: Optional output encoding (e.g., 'hex', 'base64'). Default is 'hex'.

**Returns:**

- The resulting hash as a string.

**Examples:**

```ts
import { sha1 } from '@catbee/utils/crypto';

sha1('data'); // '...'
```

---

### `sha256()`

Generate a SHA256 hash.

**Method Signature:**

```ts
function sha256(input: string, encoding?: BinaryToTextEncoding): string;
```

**Parameters:**

- `input`: The input string to hash.
- `encoding`: Optional output encoding (e.g., 'hex', 'base64'). Default is 'hex'.

**Returns:**

- The resulting hash as a string.

**Examples:**

```ts
import { sha256 } from '@catbee/utils/crypto';

sha256('data'); // '...'
```

---

### `md5()`

Generate an MD5 hash.

**Method Signature:**

```ts
function md5(input: string): string;
```

**Parameters:**

- `input`: The input string to hash.

**Returns:**

- The resulting hash as a string.

**Examples:**

```ts
import { md5 } from '@catbee/utils/crypto';

md5('data'); // '...'
```

---

### `randomString()`

Generate a cryptographically secure random string.

**Method Signature:**

```ts
function randomString(): string;
```

**Returns:**

- A cryptographically secure random string.

**Examples:**

```ts
import { randomString } from '@catbee/utils/crypto';

randomString(); // '...'
```

---

### `generateRandomBytes()`

Generate random bytes.

**Method Signature:**

```ts
function generateRandomBytes(byteLength?: number): Buffer;
```

**Parameters:**

- `byteLength`: The number of random bytes to generate. Default is 32.

**Returns:**

- A Buffer containing the random bytes.

**Examples:**

```ts
import { generateRandomBytes } from '@catbee/utils/crypto';

generateRandomBytes(16); // <Buffer ...>
```

---

### `generateRandomBytesAsString()`

Generate random bytes as a string.

**Method Signature:**

```ts
function generateRandomBytesAsString(byteLength?: number, encoding?: BinaryToTextEncoding): string;
```

**Parameters:**

- `byteLength`: The number of random bytes to generate. Default is 32.
- `encoding`: The encoding for the output string (e.g., 'hex', 'base64'). Default is 'hex'.

**Returns:**

- A string containing the random bytes in the specified encoding.

**Examples:**

```ts
import { generateRandomBytesAsString } from '@catbee/utils/crypto';

generateRandomBytesAsString(16, 'hex'); // '...'
```

---

### `generateApiKey()`

Generate an API key with optional prefix.

**Method Signature:**

```ts
function generateApiKey(prefix?: string, byteLength?: number): string;
```

**Parameters:**

- `prefix`: An optional prefix for the API key.
- `byteLength`: The number of random bytes to generate. Default is 24.

**Returns:**

- A string containing the generated API key (limited to 32 characters after prefix).

**Examples:**

```ts
import { generateApiKey } from '@catbee/utils/crypto';

generateApiKey('catbee_', 24); // 'catbee_...'
generateApiKey(); // Returns 32-character key without prefix
```

---

### `safeCompare()`

Timing-safe string comparison.

**Method Signature:**

```ts
function safeCompare(a: string | Buffer | Uint8Array, b: string | Buffer | Uint8Array): boolean;
```

**Parameters:**

- `a`: The first string or buffer to compare.
- `b`: The second string or buffer to compare.

**Returns:**

- `true` if the inputs are equal, otherwise `false`.

**Throws:**

- `Error` if inputs are not strings, Buffers, or Uint8Arrays.

**Examples:**

```ts
import { safeCompare } from '@catbee/utils/crypto';

safeCompare('abc', 'abc'); // true
safeCompare('abc', 'def'); // false
safeCompare(Buffer.from('abc'), Buffer.from('abc')); // true
```

---

### `encrypt()`

Encrypt data using AES.

**Method Signature:**

```ts
function encrypt(data: string | Buffer, key: string | Buffer, options?: EncryptionOptions): Promise<EncryptionResult>;
```

**Parameters:**

- `data`: The data to encrypt (string or Buffer).
- `key`: The encryption key (string or Buffer).
- `options`: Optional encryption options.
  - `algorithm`: The encryption algorithm (default is 'aes-256-gcm').
  - `inputEncoding`: The encoding of the input data (default is 'utf8').
  - `outputEncoding`: The encoding of the output ciphertext (default is 'base64')

**Returns:**

- A Promise that resolves to the encryption result (includes ciphertext, iv, authTag, algorithm, and salt).

**Examples:**

```ts
import { encrypt, EncryptionResult } from '@catbee/utils/crypto';

const encrypted = await encrypt('secret', 'password');
// encrypted contains: { ciphertext, iv, authTag, algorithm, salt }
```

---

### `decrypt()`

Decrypt AES encrypted data.

**Method Signature:**

```ts
function decrypt(encryptedData: EncryptionResult, key: string | Buffer, options?: DecryptionOptions): Promise<string | Buffer>;
```

**Parameters:**

- `encryptedData`: The encrypted data to decrypt (as returned by `encrypt`).
- `key`: The decryption key (string or Buffer).
- `options`: Optional decryption options.
  - `algorithm`: The decryption algorithm (default is 'aes-256-gcm').
  - `inputEncoding`: The encoding of the input ciphertext (default is 'base64').
  - `outputEncoding`: The encoding of the output data (default is 'utf8').

**Returns:**

- A Promise that resolves to the decrypted data (string or Buffer).

**Examples:**

```ts
import { decrypt, EncryptionResult } from '@catbee/utils/crypto';

const decrypted = await decrypt(encrypted, 'password');
```

---

### `createSignedToken()`

Create a signed token (JWT-like).

**Method Signature:**

```ts
function createSignedToken(payload: object, secret: string, expiresInSeconds?: number): string;
```

**Parameters:**

- `payload`: The payload to include in the token.
- `secret`: The secret key to sign the token.
- `expiresInSeconds`: Optional expiration time in seconds (default: 3600).

**Returns:**

- A signed token as a string.

**Examples:**

```ts
import { createSignedToken } from '@catbee/utils/crypto';

const token = createSignedToken({ userId: 1 }, 'secret', 3600);
const defaultToken = createSignedToken({ userId: 1 }, 'secret'); // Expires in 1 hour
```

---

### `verifySignedToken()`

Verify and decode a signed token.

**Method Signature:**

```ts
function verifySignedToken(token: string, secret: string): object | null;
```

**Parameters:**

- `token`: The signed token to verify.
- `secret`: The secret key used to sign the token.

**Returns:**

- The decoded payload if the token is valid, otherwise `null`.

**Examples:**

```ts
import { verifySignedToken } from '@catbee/utils/crypto';

const payload = verifySignedToken(token, 'secret');
if (payload) {
  console.log('Valid token:', payload);
} else {
  console.log('Invalid or expired token');
}
```

---

### `pbkdf2Hash()`

Derive a cryptographic key using PBKDF2 (Password-Based Key Derivation Function 2) with SHA-256.

**Method Signature:**

```ts
async function pbkdf2Hash(password: string, salt: string | Buffer, keyLength?: number, iterations?: number): Promise<Buffer>;
```

**Parameters:**

- `password`: Password to derive key from.
- `salt`: Cryptographic salt (use unique per password).
- `keyLength`: Output key length in bytes (default: 32).
- `iterations`: Number of hashing iterations (default: 310000, OWASP recommended).

**Returns:**

- A Promise that resolves to the derived key as a Buffer.

**Examples:**

```ts
import { pbkdf2Hash } from '@catbee/utils/crypto';

const key = await pbkdf2Hash('myPassword', 'mySalt');
const customKey = await pbkdf2Hash('myPassword', 'mySalt', 64, 500000); // 64-byte key, 500k iterations
```

---

### `generateNonce()`

Generate a cryptographically secure nonce (number used once).

**Method Signature:**

```ts
function generateNonce(byteLength?: number, encoding?: BinaryToTextEncoding): string;
```

**Parameters:**

- `byteLength`: Length of nonce in bytes (default: 16).
- `encoding`: Output encoding (default: 'hex').

**Returns:**

- A nonce string in the specified encoding.

**Examples:**

```ts
import { generateNonce } from '@catbee/utils/crypto';

const nonce = generateNonce(); // 16-byte hex nonce
const b64Nonce = generateNonce(16, 'base64'); // Base64-encoded nonce
```

---

### `secureRandomInt()`

Generate a cryptographically secure random integer in a specified range.

**Method Signature:**

```ts
function secureRandomInt(min: number, max: number): number;
```

**Parameters:**

- `min`: Minimum value (inclusive).
- `max`: Maximum value (inclusive).

**Returns:**

- A random integer between min and max (inclusive).

**Throws:**

- `Error` if min is greater than max.

**Examples:**

```ts
import { secureRandomInt } from '@catbee/utils/crypto';

const random = secureRandomInt(1, 100); // Random number 1-100
const diceRoll = secureRandomInt(1, 6); // Random dice roll
```

---

### `hashPassword()`

Hash a password using scrypt (memory-hard function).

**Method Signature:**

```ts
async function hashPassword(password: string, saltLength?: number, keyLength?: number): Promise<string>;
```

**Parameters:**

- `password`: The password to hash.
- `saltLength`: Length of salt in bytes (default: 16).
- `keyLength`: Length of derived key in bytes (default: 32).

**Returns:**

- A Promise that resolves to a hash string in the format `salt:hash` (both base64-encoded).

**Examples:**

```ts
import { hashPassword } from '@catbee/utils/crypto';

const hash = await hashPassword('myPassword');
// Store hash in database
await db.users.update({ id: userId }, { passwordHash: hash });
```

---

### `verifyPassword()`

Verify a password against a scrypt hash.

**Method Signature:**

```ts
async function verifyPassword(password: string, hash: string): Promise<boolean>;
```

**Parameters:**

- `password`: The password to verify.
- `hash`: The hash to verify against (from `hashPassword()`).

**Returns:**

- A Promise that resolves to `true` if the password matches, otherwise `false`.

**Examples:**

```ts
import { verifyPassword } from '@catbee/utils/crypto';

const isValid = await verifyPassword('myPassword', storedHash);
if (isValid) {
  console.log('Password is correct');
} else {
  console.log('Invalid password');
}
```

---

### `generateKeys()`

Generate a public/private key pair.

**Method Signature:**

```ts
function generateKeys(options: GenerateKeyOptions = {}): Promise<GenerateKeyResult>;
```

**Parameters:**

- `options`: Configuration options for key generation (type, modulusLength, hash, namedCurve, extractable, includeCryptoKeys, formatPemLines, addPrefixSuffix).

**Returns:**

- A Promise that resolves to an object containing the generated keys and related information.

**Examples:**

```ts
import { generateKeys } from '@catbee/utils/crypto';
const { publicKey, privateKey } = await generateKeys({
  type: 'Ed25519',
  extractable: true,
  includeCryptoKeys: true
});
console.log('Public Key:', publicKey);
console.log('Private Key:', privateKey);
```

---

### `sign()`

Sign data with a private key.

**Method Signature:**

```ts
function sign(data: string | Buffer | Uint8Array, privateKeyCrypto: CryptoKey, options: SignatureOptions = {}): Promise<string>;
```

**Parameters:**

- `data`: The data to sign (string, Buffer, or Uint8Array).
- `privateKeyCrypto`: The private CryptoKey to use for signing.
- `options`: Optional signature options (algorithm, encoding).

**Returns:**

- A Promise that resolves to the signature as a string.

**Examples:**

```ts
import { sign } from '@catbee/utils/crypto';
const signature = await sign('data to sign', privateKeyCrypto);
console.log('Signature:', signature);
```

---

### `verify()`

Verify a signature with a public key.

**Method Signature:**

```ts
function verify(data: string | Buffer | Uint8Array, signature: string | Buffer | Uint8Array, publicKeyCrypto: CryptoKey, options: VerifyOptions = {}): Promise<boolean>;
```

**Parameters:**

- `data`: The original data that was signed (string, Buffer, or Uint8Array).
- `signature`: The signature to verify (string, Buffer, or Uint8Array).
- `publicKeyCrypto`: The public CryptoKey to use for verification.
- `options`: Optional verification options (algorithm, encoding).

**Returns:**

- A Promise that resolves to `true` if the signature is valid, otherwise `false`.

**Examples:**

```ts
import { verify } from '@catbee/utils/crypto';
const isValid = await verify('data to sign', signature, publicKeyCrypto);
console.log('Signature valid:', isValid);
```

---

### `importKey()`

Import a PEM or JWK asymmetric key.

**Method Signature:**

```ts
function importKey(key: string | JsonWebKey, options: ImportKeyOptions = {}): Promise<CryptoKey>;
```

**Parameters:**

- `key`: The key to import, either as a PEM string or a JsonWebKey object.
- `options`: Optional import options (format, algorithm, extractable, keyUsages).

**Returns:**

- A Promise that resolves to a CryptoKey object.

**Examples:**

```ts
import { importKey } from '@catbee/utils/crypto';
const pemKey = `-----BEGIN PUBLIC KEY-----
...key data...
-----END PUBLIC KEY-----`;
const cryptoKey = await importKey(pemKey, { format: 'pem', algorithm: 'RSA-PSS', extractable: false, keyUsages: ['verify'] });
```

---

### `exportKey()`

Export a key to PEM or JWK.

**Method Signature:**

```ts
function exportKey(key: CryptoKey, format: 'jwk' | 'pem' = 'jwk', options: ExportKeyOptions = {}): Promise<JsonWebKey | string>;
```

**Parameters:**

- `key`: The CryptoKey to export.
- `format`: The format to export the key in ('jwk' or 'pem').
- `options`: Optional export options (formatPemLines, addPrefixSuffix).

**Returns:**

- A Promise that resolves to the exported key as a JsonWebKey object or a PEM string.

**Examples:**

```ts
import { exportKey } from '@catbee/utils/crypto';
const jwk = await exportKey(cryptoKey, 'jwk');
const pem = await exportKey(cryptoKey, 'pem', { formatPemLines: true, addPrefixSuffix: true });
console.log('JWK:', jwk);
console.log('PEM:', pem);
```

---

### `fingerprint()`

Generate a fingerprint for a key.

**Method Signature:**

```ts
function fingerprint(publicKey: CryptoKey, encoding: SignatureEncoding = 'base64url'): Promise<string>;
```

**Parameters:**

- `publicKey`: The public CryptoKey to generate a fingerprint for.
- `encoding`: The encoding for the output fingerprint (default is 'base64url').

**Returns:**

- A Promise that resolves to the fingerprint string.

**Examples:**

```ts
import { fingerprint } from '@catbee/utils/crypto';
const keyFingerprint = await fingerprint(publicKeyCrypto);
console.log('Key Fingerprint:', keyFingerprint);
```

### `getKeyId()`

Generate a key ID for a key.

**Method Signature:**

```ts
function getKeyId(publicKey: CryptoKey): Promise<string>;
```

**Parameters:**

- `publicKey`: The public CryptoKey to generate a key ID for.
  **Returns:**
- A Promise that resolves to the key ID string.

**Examples:**

```ts
import { getKeyId } from '@catbee/utils/crypto';
const keyId = await getKeyId(publicKeyCrypto);
console.log('Key ID:', keyId);
```
