export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "/api";

type RequestConfig = RequestInit & {
  timeout?: number;
};

async function parseResponseBody(
  response: Response,
): Promise<unknown> {
  const contentType =
    response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export async function apiRequest<T>(
  endpoint: string,
  config: RequestConfig = {},
): Promise<T> {
  const {
    timeout = 15000,
    signal,
    headers,
    ...requestInit
  } = config;

  const controller = new AbortController();

  const timeoutId = window.setTimeout(
    () => controller.abort(),
    timeout,
  );

  const abortHandler = () => controller.abort();

  signal?.addEventListener("abort", abortHandler);

  try {
    const response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...requestInit,
        signal: controller.signal,
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...headers,
        },
      },
    );

    const body = await parseResponseBody(response);

    if (!response.ok) {
      const errorBody =
        typeof body === "object" &&
        body !== null
          ? (body as {
              message?: string;
              code?: string;
            })
          : undefined;

      throw new ApiError(
        errorBody?.message ??
          `Request failed with status ${response.status}`,
        response.status,
        errorBody?.code,
      );
    }

    return body as T;
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name === "AbortError"
    ) {
      throw new ApiError(
        "Request timed out. Please try again.",
        408,
        "REQUEST_TIMEOUT",
      );
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      "Unable to connect to the server. Please try again.",
      0,
      "NETWORK_ERROR",
    );
  } finally {
    window.clearTimeout(timeoutId);
    signal?.removeEventListener("abort", abortHandler);
  }
}

export const api = {
  get<T>(
    endpoint: string,
    config?: RequestConfig,
  ): Promise<T> {
    return apiRequest<T>(endpoint, {
      ...config,
      method: "GET",
    });
  },

  post<TResponse, TBody>(
    endpoint: string,
    body: TBody,
    config?: RequestConfig,
  ): Promise<TResponse> {
    return apiRequest<TResponse>(endpoint, {
      ...config,
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  put<TResponse, TBody>(
    endpoint: string,
    body: TBody,
    config?: RequestConfig,
  ): Promise<TResponse> {
    return apiRequest<TResponse>(endpoint, {
      ...config,
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  patch<TResponse, TBody>(
    endpoint: string,
    body: TBody,
    config?: RequestConfig,
  ): Promise<TResponse> {
    return apiRequest<TResponse>(endpoint, {
      ...config,
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  delete<T>(
    endpoint: string,
    config?: RequestConfig,
  ): Promise<T> {
    return apiRequest<T>(endpoint, {
      ...config,
      method: "DELETE",
    });
  },
};
