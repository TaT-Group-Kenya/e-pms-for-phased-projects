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

interface ErrorResult {
  message: string;
  details?: Record<string, string[]>;
}

/**
 * Extracts error message from API response
 * @param response - The fetch Response object
 * @returns Promise with extracted error message and details
 */
export const extractApiError = async (response: Response): Promise<ErrorResult> => {
  let errorData: ApiErrorResponse = {};

  try {
    // Try to parse the response as JSON
    errorData = await response.json();
  } catch {
    // If parsing fails, use status text
    return {
      message: response.statusText || `Request failed with status ${response.status}`,
    };
  }

  // Extract main message
  let message = errorData.message || `Request failed with status ${response.status}`;

  // If there are field-specific errors, format them nicely
  if (errorData.errors && Object.keys(errorData.errors).length > 0) {
    const fieldErrors = Object.entries(errorData.errors)
      .map(([field, errors]) => `${field}: ${errors.join(", ")}`)
      .join("; ");

    message = `${message} (${fieldErrors})`;
  }

  return {
    message,
    details: errorData.errors,
  };
};

interface FetchResult<T = any> {
  data: T | null;
  error: string | null;
  details?: Record<string, string[]>;
}

export const fetchWithErrorHandlingSafe = async <T = any>(
  url: string,
  options?: RequestInit
): Promise<FetchResult<T>> => {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await extractApiError(response);
      return {
        data: null,
        error: error.message,
        details: error.details,
      };
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return {
        data: data.data || data,
        error: null,
      };
    }
    
    return {
      data: {} as T,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "An unexpected error occurred",
    };
  }
};
