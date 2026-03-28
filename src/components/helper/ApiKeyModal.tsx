import React, { useState } from "react";
import Button from "./Button";
import * as aiService from "#/services";
import "#/assets/ai_key_modal.css";

interface ApiKeyModalProps {
  isOpen: boolean;
  onSave: (key: string) => void;
  onCancel: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onSave, onCancel }) => {
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveAndTest = async () => {
    if (!apiKey.trim()) {
      setError("Vui lòng nhập một API Key.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const isValid = await aiService.testSingleKey(apiKey);
      if (isValid) {
        onSave(apiKey);
      } else {
        setError("API Key không hợp lệ. Vui lòng kiểm tra lại.");
      }
    } catch (e) {
      setError("Đã xảy ra lỗi khi kiểm tra API Key.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setApiKey("");
    setError(null);
    setIsLoading(false);
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="ai_key_modal_main_div">
      <div className="ai_key_modal_second_div">
        <button onClick={handleClose} className="ai_key_modal_close_btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-xl font-bold mb-2 text-cyan-400">Yêu Cầu API Key</h2>
        <p className="text-sm text-slate-400 mb-4">
          Để sử dụng tính năng AI, bạn cần cung cấp một Gemini API Key. Key của bạn sẽ được lưu an
          toàn trong trình duyệt.
        </p>

        <div className="space-y-2">
          <label htmlFor="api-key-input" className="block text-sm font-medium text-slate-300">
            Gemini API Key
          </label>
          <input
            id="api-key-input"
            type="password"
            placeholder="Dán API key của bạn ở đây"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="ai_key_modal_input"
          />
        </div>

        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

        <div className="ai_key_modal_third_div">
          <button onClick={handleClose} className="ai_key_modal_cancel_btn">
            Hủy Bỏ
          </button>
          <Button
            onClick={handleSaveAndTest}
            disabled={isLoading}
            variant="primary"
            className="w-auto! py-2! px-5! text-base!"
          >
            {isLoading ? "Đang kiểm tra..." : "Lưu & Kiểm Tra"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
