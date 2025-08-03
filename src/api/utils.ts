// API utility functions for error handling and CORS management

export class APIError extends Error {
  status: number;
  isCorsError: boolean;

  constructor(message: string, status: number, isCorsError: boolean = false) {
    super(message);
    this.status = status;
    this.isCorsError = isCorsError;
    this.name = 'APIError';
  }
}

export const handleFetchError = async (response: Response): Promise<never> => {
  let errorMessage: string;
  let isCorsError = false;

  try {
    const errorText = await response.text();
    errorMessage = errorText || `HTTP error! status: ${response.status}`;
  } catch {
    errorMessage = `HTTP error! status: ${response.status}`;
  }

  // Check for common CORS error indicators
  if (response.status === 0 || response.type === 'opaque') {
    isCorsError = true;
    errorMessage = 'CORS error: Unable to connect to the API. This might be due to a cross-origin request issue.';
  }

  throw new APIError(errorMessage, response.status, isCorsError);
};

export const makeAPIRequest = async (
  url: string, 
  options: RequestInit
): Promise<Response> => {
  try {
    const response = await fetch(url, {
      ...options,
      mode: 'cors',
      credentials: 'omit',
    });

    if (!response.ok) {
      await handleFetchError(response);
    }

    return response;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      // This is likely a CORS or network error
      throw new APIError(
        'Network error: Unable to connect to the API. Please check your internet connection or try again later.',
        0,
        true
      );
    }
    throw error;
  }
};

export const getAPIErrorMessage = (error: unknown): string => {
  if (error instanceof APIError) {
    if (error.isCorsError) {
      return `CORS Error: ${error.message}. Try refreshing the page or contact support if the issue persists.`;
    }
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unknown error occurred';
};
