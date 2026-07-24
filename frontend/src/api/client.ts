import { ApiResult } from "../types/task";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export class ApiClientError extends Error {
  errors: string[];
  constructor(message: string, errors: string[] = []) {
    super(message);
    this.errors = errors;
  }
}

/**
 * Thin fetch wrapper shared by all API calls.
 * Always parses the backend's { success, data/message } envelope and
 * throws a typed ApiClientError on failure so UI code can show a real
 * message instead of a generic "network error".
 */
export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new ApiClientError(
      "Could not reach the server. Please check your connection and try again."
    );
  }

  let body: ApiResult<T> | undefined;
  try {
    body = await response.json();
  } catch {
    // No/invalid JSON body (e.g. a network gateway error page)
  }

  if (!response.ok || !body || body.success === false) {
    const message = body?.message || `Request failed with status ${response.status}`;
    const errors = body && "errors" in body ? body.errors || [] : [];
    throw new ApiClientError(message, errors);
  }

  return (body as { data: T }).data;
}
