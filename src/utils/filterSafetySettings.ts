import { HarmCategory } from '@google/genai';

const whitelist = {
  [HarmCategory.HARM_CATEGORY_HARASSMENT]: true,
  [HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT]: true,
  [HarmCategory.HARM_CATEGORY_HATE_SPEECH]: true,
  [HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT]: true,
}

export function filterSafetySettings(safetySettings: SafetySettingsConfig): SafetySetting[] {
  const arr = safetySettings.settings;

  return arr.map(v=>whitelist[v.category])
}