class ErrorResponse extends Error {
  public statusCode: number;

  constructor(
    message?: string,
    statusCode: number = 500,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.statusCode = statusCode;
  }
}

export default ErrorResponse;
