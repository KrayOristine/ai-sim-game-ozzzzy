import type { HarmCategory, HarmBlockThreshold } from '@google/genai';
export {};
declare global {
  type SafetySetting = {
    category: HarmCategory;
    threshold: HarmBlockThreshold;
  };
  interface SafetySettingsConfig {
    enabled: boolean;
    settings: SafetySetting[];
  }
  interface RagSettings {
    summaryFrequency: number;
    topK: number;
    summarizeBeforeRag: boolean;
  }
  interface AiPerformanceSettings {
    maxOutputTokens: number;
    thinkingBudget: number;
    thinkingLevel: string;
    jsonBuffer: number;
    selectedModel?: string;
  }
  interface AppSettings {
    apiKeyConfig: ApiKeyStorage;
    safetySettings: SafetySettingsConfig;
    ragSettings: RagSettings;
    aiPerformanceSettings: AiPerformanceSettings;
  }
  interface ApiKeyStorage {
    keys: string[];
  }

}
