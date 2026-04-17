export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  version: string;
}

export interface ApiError {
  errorCode: string;
  message: string;
  detail?: Record<string, unknown>;
}
