// Vitest runs in ESM-compatible environment but our TypeScript output is CommonJS.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const electronBinary = require('electron');

export function getElectronBinaryPath(): string {
  if (typeof electronBinary === 'string') {
    return electronBinary;
  }

  if (electronBinary && typeof electronBinary === 'object' && 'default' in electronBinary) {
    return (electronBinary.default ?? electronBinary) as string;
  }

  throw new Error('Unable to determine electron binary path');
}
