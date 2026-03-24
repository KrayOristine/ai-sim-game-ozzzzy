export {};
declare global {
  interface TemporaryRule {
    text: string;
    enabled: boolean;
  }

  interface WorldConfig {
    storyContext: {
      worldName: string;
      genre: string;
      setting: string;
    };
    character: CharacterConfig;
    difficulty: string;
    aiResponseLength?: string;
    backgroundKnowledge?: { name: string; content: string }[];
    allowAdultContent: boolean;
    allowCheatEffects: boolean;
    sexualContentStyle?: string;
    violenceLevel?: string;
    storyTone?: string;
    enableStatsSystem: boolean;
    enableMilestoneSystem: boolean; // Thêm trường mới
    coreRules: string[];
    initialEntities: InitialEntity[];
    temporaryRules: TemporaryRule[];
  }
}
