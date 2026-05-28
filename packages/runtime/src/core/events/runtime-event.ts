export interface RuntimeEvent {
  id?: string;

  type: string;

  source?: string;

  workflow?: string;

  service?: string;

  provider?: string;

  payload?: unknown;

  error?: string;

  metadata?: Record<string, unknown>;

  timestamp?: number;
}
