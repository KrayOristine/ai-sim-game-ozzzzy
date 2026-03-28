import {
  DEFAULT_SAFETY_SETTINGS,
  DEFAULT_RAG_SETTINGS,
  DEFAULT_AI_PERFORMANCE_SETTINGS,
} from "#/constants";

const SETTINGS_STORAGE_KEY = "ai_rpg_settings";

// Default structure for a new user
const DEFAULT_SETTINGS: AppSettings = {
  apiKeyConfig: { keys: [] },
  safetySettings: DEFAULT_SAFETY_SETTINGS,
  ragSettings: DEFAULT_RAG_SETTINGS,
  aiPerformanceSettings: DEFAULT_AI_PERFORMANCE_SETTINGS,
};

const settings_cache: AppSettings[] = [];

export const getSettings = (): AppSettings => {
  try {
    if (settings_cache.length > 0) {
      return settings_cache[0];
    }

    const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (storedSettings) {
      const parsed = JSON.parse(storedSettings) as Partial<AppSettings>;
      // Merge parsed settings with defaults to ensure all keys exist
      const mergedSettings: AppSettings = {
        ...DEFAULT_SETTINGS,
        ...parsed,
        apiKeyConfig: parsed.apiKeyConfig || DEFAULT_SETTINGS.apiKeyConfig,
        safetySettings: {
          ...DEFAULT_SETTINGS.safetySettings,
          ...(parsed.safetySettings || {}),
        },
        ragSettings: {
          ...DEFAULT_SETTINGS.ragSettings,
          ...(parsed.ragSettings || {}),
        },
        aiPerformanceSettings: {
          ...DEFAULT_SETTINGS.aiPerformanceSettings,
          ...(parsed.aiPerformanceSettings || {}),
        },
      };
      settings_cache.push(mergedSettings);
      return mergedSettings;
    }

    settings_cache.push(DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error("Error getting settings from localStorage:", error);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: AppSettings): void => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    settings_cache.pop();
  } catch (error) {
    console.error("Error saving settings to localStorage:", error);
  }
};
