export interface RuntimeEvent {
    id: string;
    type: string;
    timestamp: number;
    source: string;
    payload?: unknown;
    metadata?: Record<string, unknown>;
}