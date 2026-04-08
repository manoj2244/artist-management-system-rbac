class AppError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

function toErrorResponse(error) {
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      body: {
        message: error.message,
        details: error.details || null
      }
    };
  }

  return {
    statusCode: 500,
    body: {
      message: 'Internal server error',
      details: null
    }
  };
}

module.exports = { AppError, toErrorResponse };
