export {};
// For storing entity vectors in the database
declare global {
  interface EntityVector {
    id: string; // Unique identifier (e.g., entity name), should match VectorUpdate id
    worldId: string; // Dấu vân tay của phiên chơi
    embedding: number[];
  } // For RAG updates triggered by TagProcessors

  interface VectorUpdate {
    id: string; // Unique identifier (e.g., entity name)
    type: string; // Entity type (e.g., 'NPC', 'Quest', 'Item')
    content: string; // The text content to be embedded
  }
  // For storing vectors of summaries

  interface SummaryVector {
    summaryId: number; // Could be Date.now()
    worldId: string; // Dấu vân tay của phiên chơi
    summaryIndex: number; // The index of the summary in the summaries array
    content: string; // The text content of the summary
    embedding: number[];
  }
  // For storing vectors of individual game turns

  interface TurnVector {
    turnId: number; // Could be Date.now() or an incrementing number
    worldId: string; // Dấu vân tay của phiên chơi
    turnIndex: number; // The index of the turn in the history array
    content: string; // The text content of the turn
    embedding: number[];
  }
  interface StyleGuideVector {
    pronoun_rules: string;
    exclusion_list: string[];
  }
}
