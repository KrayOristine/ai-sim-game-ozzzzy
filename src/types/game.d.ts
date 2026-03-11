export {};
declare global {
  interface StartGameResponse {
    narration: string;
    suggestions: ActionSuggestion[];
    initialPlayerStatus?: StatusEffect[];
    initialInventory?: GameItem[];
    initialWorldTime?: WorldTime;
    timePassed?: TimePassed;
    reputationChange?: {
      score: number;
      reason: string;
    };
    reputationTiers?: string[];
  } // For dynamic, turn-by-turn state changes

  interface DynamicStateUpdateResponse {
    updatedInventory?: GameItem[];
    updatedPlayerStatus?: StatusEffect[];
    updatedCompanions?: Companion[];
    updatedQuests?: Quest[];
    updatedStats?: CharacterStat[];
  }
  // For static/encyclopedic knowledge

  interface EncyclopediaEntriesUpdateResponse {
    updatedEncounteredNPCs?: EncounteredNPC[];
    updatedEncounteredFactions?: EncounteredFaction[];
    updatedDiscoveredEntities?: InitialEntity[];
  }
  // For player character's long-term state

  interface CharacterStateUpdateResponse {
    updatedCharacter?: Partial<Pick<CharacterConfig, "bio" | "motivation">>;
    updatedSkills?: { name: string; description: string }[];
    newMemories?: string[];
    timePassed?: TimePassed;
    reputationChange?: {
      score: number;
      reason: string;
    };
  }
  interface AiTurnResponse {
    narration: string;
    suggestions: ActionSuggestion[];
    newSummary?: string;
  }
  interface GameState {
    worldId?: string; // Dấu vân tay định danh cho phiên chơi
    worldConfig: WorldConfig;
    character: CharacterConfig;
    history: GameTurn[];
    memories: string[];
    summaries: string[];
    playerStatus: StatusEffect[];
    inventory: GameItem[];
    encounteredNPCs: EncounteredNPC[];
    encounteredFactions: EncounteredFaction[];
    discoveredEntities: InitialEntity[];
    companions: Companion[];
    quests: Quest[];
    suggestions?: ActionSuggestion[];
    worldTime: WorldTime;
    reputation: Reputation;
    reputationTiers: string[]; // 5 tiers from most infamous to most famous
    season: string;
    weather: string;
    npcDossiers?: Record<string, NpcDossier>; // Hồ sơ tương tác với NPC, key là tên NPC (lowercase)
    currentLocationId?: string; // Vị trí hiện tại của người chơi
    customCategories?: string[]; // Danh sách các danh mục tùy chỉnh do người chơi tạo

    // Hàng đợi các mục cần vector hóa (Ký gửi cho lượt sau)
    pendingVectorBuffer?: PendingVectorItem[];
  }
  interface GameTurn {
    type: "narration" | "action";
    content: string;
    metadata?: {
      isSummaryTurn?: boolean;
      addedMemoryCount?: number;
    };
  }

  interface StatusEffect {
    name: string;
    description: string;
    type: "buff" | "debuff";
  }

  interface GameItem {
    name: string;
    description: string;
    quantity: number;
    tags?: string[];
    customCategory?: string; // Phân loại động từ AI
    details?: {
      subType?: string;
      rarity?: string;
      stats?: string;
      effects?: string;
    };
  }

  interface Companion {
    name: string;
    description: string;
    personality?: string;
    tags?: string[];
    customCategory?: string; // Phân loại động từ AI
  }

  type QuestType = "MAIN" | "SIDE" | "CHARACTER";

  interface SubTask {
    id: string; // Tên hoặc ID ngắn gọn của task con
    desc: string; // Mô tả task
    isCompleted: boolean;
  }

  interface Quest {
    name: string;
    description: string;
    status: "đang tiến hành" | "hoàn thành" | "thất bại";
    tags?: string[];
    customCategory?: string; // Phân loại động từ AI

    // --- Các trường mới cho hệ thống Quest nâng cao ---
    type?: QuestType;
    currentObjective?: string; // Mục tiêu cụ thể hiện tại (VD: "Tìm chìa khóa kho")
    logs?: string[]; // Nhật ký tiến độ kèm thời gian
    subTasks?: SubTask[]; // Danh sách việc cần làm nhỏ
    parentQuestId?: string; // Để liên kết chuỗi nhiệm vụ (Chain)
  }

  interface EncounteredNPC {
    name: string;
    description: string;
    personality: string;
    thoughtsOnPlayer: string;
    tags?: string[];
    memoryFlags?: Record<string, boolean | string | number>;
    customCategory?: string; // Phân loại động từ AI
    locationId?: string; // Vị trí của NPC
    physicalState?: string; // Trạng thái vật lý/ngoại hình hiện tại
    emotionalState?: {
      current: string; // VD: "Giận dữ", "Vui vẻ"
      value: number; // 0-100 (Cường độ)
    };
  }

  interface EncounteredFaction {
    name: string;
    description: string;
    tags?: string[];
    customCategory?: string; // Phân loại động từ AI
  }

  interface WorldTime {
    year: number;
    month: number;
    day: number;
    hour: number; // 0-23
    minute: number; // 0-59
  }

  interface Reputation {
    score: number; // -100 to 100
    tier: string;
  }

  interface NpcDossier {
    fresh: number[]; // Mảng các index trong history
    archived: string[]; // Mảng các tóm tắt sự kiện cũ
  }
  // --- PIGGYBACK VECTORIZATION TYPES ---

  interface PendingVectorItem {
    id: string | number; // turnIndex cho Turn, name cho Entity
    type: string; // 'Turn' | 'Entity' | 'NPC' | 'Item' ...
    content: string; // Nội dung văn bản cần vector hóa
  }
  // --- STORY GRAPH TYPES (GRAPH RAG) ---

  interface GraphNode {
    id: string; // Tên thực thể (Unique ID)
    type: string; // NPC, Location, Item, Event, Concept
    label: string; // Tên hiển thị
    data?: any; // Dữ liệu phụ
  }

  interface GraphEdge {
    source: string; // ID node nguồn
    target: string; // ID node đích
    relation: string; // Mối quan hệ (VD: "ghét", "sở hữu", "ở tại")
    weight?: number; // Trọng số quan hệ (1-10)
    description?: string; // Mô tả chi tiết mối quan hệ
  }

  interface FandomFile {
    id: number; // Date.now()
    name: string;
    content: string;
    date: string; // ISO String
  }

  interface ActionSuggestion {
    description: string;
    successRate: number;
    risk: string;
    reward: string;
  }

  interface TimePassed {
    years?: number;
    months?: number;
    days?: number;
    hours?: number;
    minutes?: number;
  }
}
