export {};
declare global {
  interface EncyclopediaOptimizationResponse {
    optimizedNPCs: EncounteredNPC[];
    optimizedFactions: EncounteredFaction[];
    optimizedDiscoveredEntities: InitialEntity[];
    optimizedInventory: GameItem[];
    optimizedCompanions: Companion[];
    optimizedQuests: Quest[];
    optimizedSkills: { name: string; description: string }[];
  }
  interface EncyclopediaData {
    encounteredNPCs: EncounteredNPC[];
    encounteredFactions: EncounteredFaction[];
    discoveredEntities: InitialEntity[];
    inventory: GameItem[];
    companions: Companion[];
    quests: Quest[];
    skills: { name: string; description: string }[];
    initialEntities?: InitialEntity[]; // Thêm để xuất/nhập đầy đủ
    customCategories?: string[]; // Thêm để xuất/nhập đầy đủ
  }
}
