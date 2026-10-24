export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code?: string;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    code?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static badRequest(message: string, code?: string) {
    return new AppError(message, 400, true, code);
  }

  static unauthorized(message: string = 'অনুমতি নেই। দয়া করে লগইন করুন।') {
    return new AppError(message, 401, true, 'UNAUTHORIZED');
  }

  static forbidden(message: string = 'আপনার এই কাজের অনুমতি নেই।') {
    return new AppError(message, 403, true, 'FORBIDDEN');
  }

  static notFound(message: string = 'তথ্য পাওয়া যায়নি।') {
    return new AppError(message, 404, true, 'NOT_FOUND');
  }

  static conflict(message: string, code?: string) {
    return new AppError(message, 409, true, code);
  }

  static tooMany(message: string = 'অনেক বেশি অনুরোধ। কিছুক্ষণ পর আবার চেষ্টা করুন।') {
    return new AppError(message, 429, true, 'RATE_LIMITED');
  }

  static internal(message: string = 'সার্ভারে সমস্যা হয়েছে।') {
    return new AppError(message, 500, false, 'INTERNAL_ERROR');
  }
}
