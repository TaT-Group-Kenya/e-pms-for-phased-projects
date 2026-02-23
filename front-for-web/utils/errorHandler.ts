interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
  [key: string]: any;
}

export function formatApiError(data: ApiErrorResponse): string {
  if (!data || typeof data !== 'object') {
    return 'An error occurred';
  }

  const errorMessages: string[] = [];

  Object.entries(data).forEach(([key, value]) => {
    if (key !== 'message' && key !== 'errors' && Array.isArray(value)) {
      errorMessages.push(...value.filter(msg => typeof msg === 'string'));
    }
  });

  if (errorMessages.length === 0 && data.errors && Object.keys(data.errors).length > 0) {
    Object.entries(data.errors).forEach(([, messages]) => {
      if (Array.isArray(messages)) {
        errorMessages.push(...messages.filter(msg => typeof msg === 'string'));
      }
    });
  }

  if (errorMessages.length > 0) {
    return errorMessages.join('\n');
  }

  return data.message || 'Failed to create customer';
}
