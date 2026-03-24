export {};
declare global {
  interface SaveSlot extends GameState {
    //hashId: string;
    saveId: number; // Using Date.now()
    saveDate: string; // ISO String for display
    previewText: string;
    worldName: string;
    saveType: "manual" | "auto";
  }
}
