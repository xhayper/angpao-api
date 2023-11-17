export class InvalidVoucherUrlError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'InvalidVoucherUrlError';
  }
}
