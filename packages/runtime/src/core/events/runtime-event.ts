export interface RuntimeEvent {
  id?: string;

  type: string;

  source?: string;

  workflow?: string;

  service?: string;

  provider?: string;

  agent?: string;

  payload?: unknown;

  error?: string;

  metadata?: Record<string, unknown>;

  timestamp?: number;
}
