export {};
declare global {
  interface CharacterStat {
    name: string;
    value: number;
    maxValue: number;
    isPercentage: boolean;
    description?: string;
    hasLimit?: boolean;
  } // Thêm interface mới cho các chỉ số dạng chữ (Cột mốc)

  interface CharacterMilestone {
    name: string; // Tên của cột mốc. VD: "Cảnh giới", "Thân phận", "Công pháp chính"
    value: string; // Giá trị hiện tại của cột mốc. VD: "Trúc Cơ", "Nội môn Đệ tử", "Vạn Kiếm Quy Tông"
    description: string; // Giải thích cho AI biết ý nghĩa của cột mốc này.
    category: string; // Phân loại để dễ quản lý. VD: "Tu Luyện", "Thế Lực", "Thân Thể"
  }
  interface CharacterConfig {
    name: string;
    personality: string;
    customPersonality?: string;
    gender: string;
    bio: string;
    skills: {
      name: string;
      description: string;
    }[];
    stats: CharacterStat[];
    milestones: CharacterMilestone[]; // << THÊM TRƯỜNG MỚI NÀY
    motivation: string;
  }
}
