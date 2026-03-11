export {};
declare global {
  interface FandomDatasetChunk {
    id: string;
    text: string;
    embedding?: number[];
  }
  interface FandomDataset {
    metadata: {
      sourceName: string;
      createdAt: string;
      totalChunks: number;
      chunkSize: number;
      overlap: number;
      embeddingModel?: string;
    };
    chunks: FandomDatasetChunk[];
  }
}
