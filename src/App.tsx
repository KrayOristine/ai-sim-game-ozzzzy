import React, { useState, useCallback } from "react";
import HomeScreen from "./components/main/HomeScreen";
import WorldCreationScreen from "./components/main/WorldCreationScreen";
import SettingsScreen from "./components/main/SettingsScreen";
import GameplayScreen from "./components/main/GameplayScreen";
import FandomGenesisScreen from "./components/main/FandomGenesisScreen";
import { DEFAULT_STATS } from "./constants";
import { getSeason, generateWeather } from "./utils/timeUtils";
import { resolveGenreArchetype } from "./utils/genreUtils";

type Screen = "home" | "create" | "settings" | "gameplay" | "fandomGenesis";

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [editingConfig, setEditingConfig] = useState<WorldConfig | null>(null);

  const handleStartNew = useCallback(() => {
    setEditingConfig(null);
    setCurrentScreen("create");
  }, []);

  const handleLoadGame = useCallback((config: WorldConfig) => {
    setEditingConfig(config);
    setCurrentScreen("create");
  }, []);

  const handleStartGame = useCallback((config: WorldConfig) => {
    const worldConfigWithLore = { ...config };
    if (worldConfigWithLore.storyContext.setting) {
      const powerSystemEntity: InitialEntity = {
        name: "Tổng quan Hệ thống Sức mạnh",
        type: "Hệ thống sức mạnh / Lore",
        description: worldConfigWithLore.storyContext.setting,
        personality: "",
      };
      const existing = (worldConfigWithLore.initialEntities || []).find(
        (e) => e.name === powerSystemEntity.name && e.type === powerSystemEntity.type,
      );
      if (!existing) {
        worldConfigWithLore.initialEntities = [
          ...(worldConfigWithLore.initialEntities || []),
          powerSystemEntity,
        ];
      }
    }

    const archetype = resolveGenreArchetype(config.storyContext.genre);
    const initialTime = { year: 1, month: 1, day: 1, hour: 8, minute: 0 };
    const initialSeason = getSeason(initialTime.month, archetype);
    const initialWeather = generateWeather(initialSeason, archetype);

    // BƯỚC 1: Di trú dữ liệu NPC từ kiến tạo ban đầu
    const initialNpcs = (worldConfigWithLore.initialEntities || [])
      .filter((entity) => entity.type === "NPC")
      .map(
        (entity): EncounteredNPC => ({
          name: entity.name,
          description: entity.description,
          personality: entity.personality || "Chưa rõ",
          thoughtsOnPlayer: "Chưa có tương tác",
          tags: entity.tags || [],
          customCategory: entity.customCategory,
          locationId: entity.locationId,
          memoryFlags: {},
          physicalState: "",
        }),
      );

    setGameState({
      worldId: crypto.randomUUID().replace(/-/g, ""), // Tạo ID duy nhất cho thế giới mới
      worldConfig: worldConfigWithLore,
      character: {
        ...config.character,
        stats: config.enableStatsSystem
          ? config.character.stats && config.character.stats.length > 0
            ? config.character.stats
            : DEFAULT_STATS
          : [],
        milestones: config.enableMilestoneSystem
          ? config.character.milestones && config.character.milestones.length > 0
            ? config.character.milestones
            : []
          : [],
      },
      history: [],
      memories: [],
      summaries: [],
      playerStatus: [],
      inventory: [],
      encounteredNPCs: initialNpcs, // Sử dụng danh sách NPC đã được di trú
      encounteredFactions: [],
      discoveredEntities: [],
      companions: [],
      quests: [],
      suggestions: [],
      worldTime: initialTime,
      reputation: { score: 0, tier: "Vô Danh" },
      reputationTiers: [],
      season: initialSeason,
      weather: initialWeather,
      npcDossiers: {}, // Khởi tạo hồ sơ NPC
      customCategories: [], // Khởi tạo danh sách category tùy chỉnh
    });
    setCurrentScreen("gameplay");
  }, []);

  const handleLoadSavedGame = useCallback((state: GameState) => {
    // LOG DEBUG: Load game không tốn request
    console.groupCollapsed("📂 [INFO] Tải save");
    console.log(
      "%c✅ Không tốn request. (Dữ liệu được tải trực tiếp từ bộ nhớ)",
      "color: #4ade80; font-weight: bold;",
    );
    console.groupEnd();

    const statsEnabled = state.worldConfig.enableStatsSystem === true;
    const milestonesEnabled = state.worldConfig.enableMilestoneSystem === true;

    const worldConfigWithLore = { ...state.worldConfig };
    if (worldConfigWithLore.storyContext.setting) {
      const powerSystemEntity: InitialEntity = {
        name: "Tổng quan Hệ thống Sức mạnh",
        type: "Hệ thống sức mạnh / Lore",
        description: worldConfigWithLore.storyContext.setting,
        personality: "",
      };
      const allEntities = [
        ...(worldConfigWithLore.initialEntities || []),
        ...(state.discoveredEntities || []),
      ];
      const existing = allEntities.find(
        (e) => e.name === powerSystemEntity.name && e.type === powerSystemEntity.type,
      );
      if (!existing) {
        worldConfigWithLore.initialEntities = [
          ...(worldConfigWithLore.initialEntities || []),
          powerSystemEntity,
        ];
      }
    }

    const completeState: GameState = {
      worldId: state.worldId || (state as any).saveId || crypto.randomUUID().replace(/-/g, ""), // Gán worldId nếu chưa có
      memories: [],
      summaries: [],
      playerStatus: [],
      inventory: [],
      encounteredNPCs: [], // For old saves
      encounteredFactions: [], // For old saves
      discoveredEntities: [], // For old saves
      companions: [], // For old saves
      quests: [], // For old saves
      suggestions: [], // Fallback for old saves
      worldTime: { year: 1, month: 1, day: 1, hour: 8, minute: 0 }, // Fallback cho file lưu cũ
      reputation: { score: 0, tier: "Vô Danh" }, // Fallback cho file lưu cũ
      reputationTiers: [], // Fallback cho file lưu cũ
      season: "", // Sẽ được tính toán bên dưới
      weather: "", // Sẽ được tính toán bên dưới
      npcDossiers: {}, // Fallback cho file lưu cũ
      customCategories: [], // Fallback cho file lưu cũ
      ...state,
      worldConfig: {
        ...worldConfigWithLore,
        // Fallback for old saves that don't have this property
        enableMilestoneSystem:
          state.worldConfig.enableMilestoneSystem ??
          (state.character.milestones && state.character.milestones.length > 0),
        allowCheatEffects: true,
      },
      character: {
        ...(state.character || state.worldConfig.character), // Handle very old saves
        stats: statsEnabled
          ? state.character.stats && state.character.stats.length > 0
            ? state.character.stats
            : DEFAULT_STATS
          : [],
        milestones: milestonesEnabled ? state.character.milestones || [] : [],
      },
    };

    // Đảm bảo worldTime có minute
    completeState.worldTime = { minute: 0, ...completeState.worldTime };

    // Di chuyển npcDossiers nếu nó ở định dạng cũ
    if (completeState.npcDossiers) {
      const firstDossierKey = Object.keys(completeState.npcDossiers)[0];
      if (firstDossierKey && Array.isArray(completeState.npcDossiers[firstDossierKey])) {
        const oldDossiers = completeState.npcDossiers as unknown as Record<string, number[]>;
        const newDossiers: Record<string, NpcDossier> = {};
        for (const npcName in oldDossiers) {
          newDossiers[npcName] = {
            fresh: oldDossiers[npcName],
            archived: [],
          };
        }
        completeState.npcDossiers = newDossiers;
      }
    }

    // Tính toán mùa/thời tiết nếu thiếu
    if (!completeState.season || !completeState.weather) {
      const archetype = resolveGenreArchetype(completeState.worldConfig.storyContext.genre);
      completeState.season = getSeason(completeState.worldTime.month, archetype);
      completeState.weather = generateWeather(completeState.season, archetype);
    }

    setGameState(completeState);
    setCurrentScreen("gameplay");
  }, []);

  const handleNavigateToSettings = useCallback(() => {
    setCurrentScreen("settings");
  }, []);

  const handleNavigateToFandomGenesis = useCallback(() => {
    setCurrentScreen("fandomGenesis");
  }, []);

  const handleBackToHome = useCallback(() => {
    setGameState(null);
    setEditingConfig(null);
    setCurrentScreen("home");
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case "create":
        return (
          <WorldCreationScreen
            onBack={handleBackToHome}
            initialConfig={editingConfig}
            onStartGame={handleStartGame}
          />
        );
      case "settings":
        return <SettingsScreen onBack={handleBackToHome} />;
      case "fandomGenesis":
        return <FandomGenesisScreen onBack={handleBackToHome} />;
      case "gameplay":
        if (gameState) {
          return <GameplayScreen initialGameState={gameState} onBack={handleBackToHome} />;
        }
        // Fallback if no config
        setCurrentScreen("home");
        return null;
      case "home":
      default:
        return (
          <HomeScreen
            onStartNew={handleStartNew}
            onLoadGame={handleLoadGame}
            onLoadSavedGame={handleLoadSavedGame}
            onNavigateToSettings={handleNavigateToSettings}
            onNavigateToFandomGenesis={handleNavigateToFandomGenesis}
          />
        );
    }
  };

  return (
    <main className="bg-linear-to-br from-slate-900 to-slate-800 min-h-screen text-slate-100 font-sans">
      {renderScreen()}
    </main>
  );
};

export default App;
