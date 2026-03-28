import { ArkErrors, type } from "arktype";

export const saveWorldConfigToFile = (config: WorldConfig): void => {
  const dataStr = JSON.stringify(config, null, 2);
  const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  const exportFileDefaultName = "ai_rpg_world.json";

  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click();
};

export const saveGameStateToFile = (state: GameState): void => {
  const dataStr = JSON.stringify(state, null, 2);
  const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
  const exportFileDefaultName = "ai_rpg_save.json";
  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click();
};

export const saveTextToFile = (content: string, fileName: string): void => {
  const dataUri = "data:text/plain;charset=utf-8," + encodeURIComponent(content);
  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", fileName);
  linkElement.click();
};

export const saveJsonToFile = (data: object, defaultFileName: string): void => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", defaultFileName);
  linkElement.click();
};
const ccSchema = type({
  name: "string",
  personality: "string",
  "customPersonality?": "string",
  gender: "string",
  bio: "string",
  skills: type({
    name: "string",
    description: "string",
  }).array,
  stats: type({
    name: "string",
    value: "number",
    maxValue: "number",
    isPercentage: "boolean",
    "description?": "string",
    "hasLimit?": "boolean",
  }).array,
  milestones: type({
    name: "string",
    value: "string",
    description: "string",
    category: "string",
  }).array,
  motivation: "string",
});
const ieSchema = type({
  name: "string",
  type: type.enumerated(
    "NPC",
    "Vật phẩm",
    "Địa điểm",
    "Tri thức thế giới",
    "Phe phái/Thế lực",
    "Hệ thống sức mạnh / Lore",
  ),
  "personality?": "string",
  description: "string",
  "tags?": "string[]",
  "customCategory?": "string",
  "locationId?": "string",
  "details?": type({
    "subType?": "string",
    "rarity?": "string",
    "stats?": "string",
    "effects?": "string",
  }),
});
const trSchema = type({
  text: "string",
  enabled: "boolean",
});
const wcschema = type({
  storyContext: type({
    worldName: "string",
    genre: "string",
    setting: "string",
  }),
  character: ccSchema,
  difficulty: "string",
  "aiResponseLength?": "string",
  "backgroundKnowledge?": type({ name: "string", content: "string" }).array,
  allowAdultContent: type.boolean.default(true),
  allowCheatEffects: type.boolean.default(true),
  "sexualContentStyle?": "string",
  "violenceLevel?": "string",
  "storyTone?": "string",
  enableStatsSystem: type.boolean.default(true),
  enableMilestoneSystem: type.boolean.default(true),
  coreRules: "string[]",
  initialEntities: ieSchema.array,
  temporaryRules: trSchema.array,
});
const parseJESON = type("string.json.parse").to(wcschema);
export const loadWorldConfigFromFile = (file: File): Promise<WorldConfig> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("Vui lòng chọn một tệp hợp lệ."));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (typeof text === "string") {
          const data = parseJESON(text);
          if (data instanceof ArkErrors) {
            reject(data.toTraversalError());
            return;
          }

          resolve(data);
        } else {
          reject(new Error("Không thể đọc nội dung tệp."));
        }
      } catch (error) {
        reject(new Error(`Lỗi khi phân tích tệp JSON: ${error}`));
      }
    };
    reader.onerror = () => {
      reject(new Error("Lỗi khi đọc tệp."));
    };
    reader.readAsText(file);
  });
};

export const loadJsonFromFile = <T>(file: File): Promise<T> => {
  return new Promise((resolve, reject) => {
    if (!file || file.type !== "application/json") {
      reject(new Error("Vui lòng chọn một tệp .json hợp lệ."));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (typeof text === "string") {
          const data = JSON.parse(text) as T;
          resolve(data);
        } else {
          reject(new Error("Không thể đọc nội dung tệp."));
        }
      } catch (error) {
        reject(new Error(`Lỗi khi phân tích tệp JSON: ${error}`));
      }
    };
    reader.onerror = () => {
      reject(new Error("Lỗi khi đọc tệp."));
    };
    reader.readAsText(file);
  });
};

export const loadTextFromFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("Không có tệp nào được chọn."));
      return;
    }
    if (file.type !== "text/plain") {
      reject(new Error("Vui lòng chọn một tệp .txt hợp lệ."));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === "string") {
        resolve(text);
      } else {
        reject(new Error("Không thể đọc nội dung tệp."));
      }
    };
    reader.onerror = () => {
      reject(new Error("Lỗi khi đọc tệp."));
    };
    reader.readAsText(file);
  });
};

export const loadKeysFromTxtFile = (file: File): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    if (!file || file.type !== "text/plain") {
      reject(new Error("Vui lòng chọn một tệp .txt hợp lệ."));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (typeof text === "string") {
          const keys = text
            .split("\n")
            .map((k) => k.trim())
            .filter(Boolean);
          resolve(keys);
        } else {
          reject(new Error("Không thể đọc nội dung tệp."));
        }
      } catch (error) {
        reject(new Error(`Lỗi khi đọc tệp văn bản: ${error}`));
      }
    };
    reader.onerror = () => {
      reject(new Error("Lỗi khi đọc tệp."));
    };
    reader.readAsText(file);
  });
};
