export interface Artifact {
    id: string;

    type: string;

    filename?: string;

    mimeType?: string;

    metadata?: Record<string, unknown>;

    createdAt: number;
}