export {};
declare global {
  interface InitialEntity {
    name: string;
    type: CoreEntityType; // BẮT BUỘC: Chỉ được thuộc nhóm cứng để code xử lý.
    personality?: string;
    description: string;
    tags?: string[];
    customCategory?: string; // TÙY CHỌN: Chứa chuỗi tự do (VD: 'Cảnh giới', 'Mạng xã hội').
    locationId?: string; // Vị trí của thực thể
    details?: {
      subType?: string;
      rarity?: string;
      stats?: string;
      effects?: string;
    };
  } // Định nghĩa các loại thực thể cốt lõi mà hệ thống có thể xử lý.

  type CoreEntityType =
    | "NPC"
    | "Vật phẩm"
    | "Địa điểm"
    | "Phe phái/Thế lực"
    | "Hệ thống sức mạnh / Lore";
}
