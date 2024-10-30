export class StackCapturedError extends Error {
  constructor(message: string, stack?: string) {
    super(message);
    this.name = 'StackCapturedError';
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, StackCapturedError);
    } else {
      this.stack = new Error().stack;
    }

    this.stack += `\nCaused by: ${stack}`;
  }
}
