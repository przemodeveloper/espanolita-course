export class DomainError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(message: string, status = 400, code?: string) {
    super(message);
    this.name = "DomainError";
    this.status = status;
    this.code = code;
  }
}

export function isDomainError(err: unknown): err is DomainError {
  return err instanceof DomainError;
}
