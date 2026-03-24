import React, { useState, useEffect, useRef } from "react";
import { getSettings, saveSettings } from "@service/settingsService";
import { testApiKeys, testSingleKey } from "@service/index";
import { loadKeysFromTxtFile } from "@service/fileService";
import {
  HARM_CATEGORIES,
  HARM_BLOCK_THRESHOLDS,
} from "@const/index";
import Icon from "@component/helper/Icon";
import Button from "@component/helper/Button";
import ToggleSwitch from "@component/helper/ToggleSwitch";
import Accordion from "@component/helper/Accordion";
import "#/assets/settings.css";
import { HarmBlockThreshold, HarmCategory } from '@google/genai';

interface SettingsScreenProps {
  onBack: () => void;
}

type ValidationStatus =
  | "idle"
  | "loading"
  | "valid"
  | "invalid"
  | "rate_limited";

const StatusIcon: React.FC<{ status: ValidationStatus }> = ({ status }) => {
  switch (status) {
    case "loading":
      return (
        <div
          className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"
          title="Đang kiểm tra..."
        ></div>
      );
    case "valid":
      return (
        <Icon
          name="checkCircle"
          className="w-6 h-6 text-green-400"
          title="Key hợp lệ"
        />
      );
    case "invalid":
      return (
        <Icon
          name="xCircle"
          className="w-6 h-6 text-red-400"
          title="Key không hợp lệ."
        />
      );
    case "rate_limited":
      return (
        <Icon
          name="warning"
          className="w-6 h-6 text-amber-400"
          title="Key đã đạt giới hạn yêu cầu, HOẶC key không hợp lệ/chưa kích hoạt thanh toán. Vui lòng kiểm tra lại key của bạn."
        />
      );
    default:
      return <div className="w-6 h-6"></div>; // Placeholder for alignment
  }
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const [settings, setSettings] = useState<AppSettings>(() => getSettings());
  const [isTestingKeys, setIsTestingKeys] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const debounceTimers = useRef<{ [index: number]: number }>({});
  const [validationStatus, setValidationStatus] = useState<{
    [index: number]: ValidationStatus;
  }>({});

  useEffect(() => {
    const loadedSettings = getSettings();
    if (loadedSettings.apiKeyConfig.keys.length === 0) {
      // Ensure there's always one empty input field to start with
      loadedSettings.apiKeyConfig.keys.push("");
    }
    setSettings(loadedSettings);
  }, []);

  useEffect(() => {
    // Cleanup timers on unmount
    return () => {
      Object.values(debounceTimers.current).forEach(clearTimeout);
    };
  }, []);

  const handleSave = () => {
    const settingsToSave = {
      ...settings,
      apiKeyConfig: {
        keys: settings.apiKeyConfig.keys.filter(Boolean),
      },
    };
    saveSettings(settingsToSave);
    alert("Cài đặt đã được lưu!");
    onBack();
  };

  const handleTestAllKeys = async () => {
    setIsTestingKeys(true);
    try {
      const result = await testApiKeys();
      alert(result);
    } catch (e) {
      alert(
        e instanceof Error ? e.message : "Lỗi không xác định khi kiểm tra key.",
      );
    } finally {
      setIsTestingKeys(false);
    }
  };

  const validateAndSaveKey = async (key: string, index: number) => {
    if (!key.trim()) {
      setValidationStatus((prev) => ({ ...prev, [index]: "idle" }));
      return;
    }

    setValidationStatus((prev) => ({ ...prev, [index]: "loading" }));
    const result = await testSingleKey(key);

    // Use a function for state update to get the latest settings
    setSettings((currentSettings) => {
      // Re-check the key from state to prevent race conditions if user types fast
      if (currentSettings.apiKeyConfig.keys[index] === key) {
        if (result === "valid") {
          setValidationStatus((prev) => ({ ...prev, [index]: "valid" }));
          saveSettings(currentSettings);
        } else if (result === "rate_limited") {
          setValidationStatus((prev) => ({ ...prev, [index]: "rate_limited" }));
          saveSettings(currentSettings); // Also save on rate_limited
        } else {
          // 'invalid'
          setValidationStatus((prev) => ({ ...prev, [index]: "invalid" }));
        }
      }
      return currentSettings;
    });
  };

  const handleKeyChange = (index: number, value: string) => {
    const newKeys = [...settings.apiKeyConfig.keys];
    newKeys[index] = value;
    setSettings((prev) => ({ ...prev, apiKeyConfig: { keys: newKeys } }));

    if (debounceTimers.current[index]) {
      clearTimeout(debounceTimers.current[index]);
    }

    setValidationStatus((prev) => ({
      ...prev,
      [index]: value.trim() ? "loading" : "idle",
    }));

    if (value.trim()) {
      debounceTimers.current[index] = window.setTimeout(() => {
        validateAndSaveKey(value, index);
      }, 800); // 800ms debounce delay
    }
  };

  const addKeyInput = () => {
    setSettings((prev) => ({
      ...prev,
      apiKeyConfig: { keys: [...prev.apiKeyConfig.keys, ""] },
    }));
  };

  const removeKeyInput = (index: number) => {
    const newKeys = settings.apiKeyConfig.keys.filter((_, i) => i !== index);
    setSettings((prev) => ({ ...prev, apiKeyConfig: { keys: newKeys } }));
    setValidationStatus((prev) => {
      const newStatus = { ...prev };
      delete newStatus[index];
      return newStatus;
    });
    // Save settings after removal
    saveSettings({ ...settings, apiKeyConfig: { keys: newKeys } });
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const loadedKeys = await loadKeysFromTxtFile(file);
        const currentKeys = settings.apiKeyConfig.keys.filter(Boolean);
        const newKeys = [...currentKeys, ...loadedKeys];
        const newSettings = { ...settings, apiKeyConfig: { keys: newKeys } };
        setSettings(newSettings);
        saveSettings(newSettings); // Save immediately after loading from file
        // Optionally, trigger validation for new keys
        loadedKeys.forEach((key, i) =>
          validateAndSaveKey(key, currentKeys.length + i),
        );
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Lỗi không xác định khi đọc tệp",
        );
      }
    }
    if (event.target) {
      event.target.value = "";
    }
  };

  const handleSafetyToggle = (enabled: boolean) => {
    setSettings((prev) => ({
      ...prev,
      safetySettings: { ...prev.safetySettings, enabled },
    }));
  };

  const handleThresholdChange = (
    category: HarmCategory,
    threshold: HarmBlockThreshold,
  ) => {
    const newSafetySettings = settings.safetySettings.settings.map((s) =>
      s.category === category ? { ...s, threshold } : s,
    );
    setSettings((prev) => ({
      ...prev,
      safetySettings: { ...prev.safetySettings, settings: newSafetySettings },
    }));
  };

  const handleRagSettingChange = (field: keyof RagSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      ragSettings: {
        ...prev.ragSettings,
        [field]: value,
      },
    }));
  };

  const handleAiPerformanceSettingChange = (
    field: keyof AiPerformanceSettings,
    value: string,
  ) => {
    if (field === "selectedModel") {
      setSettings((prev) => ({
        ...prev,
        aiPerformanceSettings: {
          ...prev.aiPerformanceSettings,
          selectedModel: value,
        },
      }));
      return;
    }
    if (field === "thinkingLevel") {
      setSettings((prev) => ({
        ...prev,
        aiPerformanceSettings: {
          ...prev.aiPerformanceSettings,
          thinkingLevel: value.toLowerCase() === "minimal" ? "Low" : value,
        },
      }));
      return;
    }

    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return;

    setSettings((prev) => ({
      ...prev,
      aiPerformanceSettings: {
        ...prev.aiPerformanceSettings,
        [field]: numValue,
      },
    }));
  };

  const getInputClass = (status: ValidationStatus = "idle") => {
    switch (status) {
      case "valid":
        return "input-valid";
      case "invalid":
        return "input-invalid";
      case "rate_limited":
        return "input-rate-limited";
      case "loading":
        return "input-loading";
      default:
        return "input-default";
    }
  };

  // Cố định mức tối đa cho Flash, Pro sẽ tự động override trong code logic
  const maxThinkingBudget = 10000;

  const isHighEndModel =
    settings.aiPerformanceSettings.selectedModel?.includes("gemini-2.5-pro") ||
    settings.aiPerformanceSettings.selectedModel?.includes("gemini-3.1-pro");

  const isGen3Model =
    settings.aiPerformanceSettings.selectedModel?.includes("gemini-3");

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1 className="settings-title">Cài Đặt</h1>
        <Button onClick={onBack} variant="secondary" className="btn-back">
          <Icon name="back" className="icon-md-mr" />
          Quay lại
        </Button>
      </div>

      <Accordion
        title="Thiết lập API Key (Tự động lưu)"
        icon={<Icon name="key" />}
        borderColorClass="border-cyan-500"
        titleClassName="text-cyan-400"
      >
        <div className="text-desc-space">
          <p>
            Dán API key vào ô bên dưới. Key sẽ được tự động kiểm tra và lưu lại
            nếu hợp lệ.
          </p>
        </div>
        <div className="key-list">
          {settings.apiKeyConfig.keys.map((key, index) => (
            <div key={index} className="input-row">
              <input
                type="text"
                placeholder={`Dán API key ${index + 1} của bạn ở đây`}
                value={key}
                onChange={(e) => handleKeyChange(index, e.target.value)}
                className={getInputClass(validationStatus[index])}
              />
              <StatusIcon status={validationStatus[index] || "idle"} />
              <button
                onClick={() => removeKeyInput(index)}
                className="btn-delete"
                disabled={
                  settings.apiKeyConfig.keys.length <= 1 &&
                  settings.apiKeyConfig.keys[0] === ""
                }
              >
                <Icon name="trash" className="icon-md" />
              </button>
            </div>
          ))}
        </div>
        <div className="btn-row">
          <Button
            onClick={addKeyInput}
            variant="secondary"
            className="btn-small"
          >
            <Icon name="plus" className="icon-md-mr" /> Thêm API
          </Button>
          <Button
            onClick={handleFileUploadClick}
            variant="secondary"
            className="btn-small"
          >
            <Icon name="upload" className="icon-md-mr" /> Tải lên từ tệp (.txt)
          </Button>
          <Button
            onClick={handleTestAllKeys}
            variant="special"
            className="btn-small"
            disabled={isTestingKeys}
          >
            {isTestingKeys ? "Đang kiểm tra..." : "Kiểm tra tất cả Keys"}
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".txt"
          />
        </div>
      </Accordion>

      <Accordion
        title="Cài đặt an toàn Gemini API"
        icon={<Icon name="warning" />}
        borderColorClass="border-blue-500"
        titleClassName="text-blue-400"
      >
        <p className="text-desc">
          Cấu hình mức độ chặn nội dung không an toàn. Ảnh hưởng đến tất cả phản
          hồi AI.
        </p>
        <div className="info-box">
          <h3 className="heading-section">Chế độ hoạt động kép</h3>
          <div className="text-info">
            <p>
              <strong className="text-strong">
                Bật lọc an toàn (Chế độ Tiêu chuẩn):
              </strong>{" "}
              Văn bản của bạn được gửi trực tiếp đến Gemini API và bộ lọc an
              toàn sẽ hoạt động theo các mức chặn bạn đã định cấu hình bên dưới.
              Sử dụng chế độ này cho nội dung thông thường.
            </p>
            <p>
              <strong className="text-strong">
                Tắt lọc an toàn (Chế độ Vượt qua An toàn):
              </strong>{" "}
              Để xử lý nội dung nhạy cảm (khi tùy chọn 18+ được bật) và tránh
              lỗi "prohibited", công cụ sẽ kích hoạt một giao thức đặc biệt. Văn
              bản đầu vào của bạn sẽ được làm mờ và AI sẽ được
              hướng dẫn theo một "Giao thức Nghiên cứu Học thuật" để giải mã và
              xử lý nội dung gốc một cách trung thực và không bị kiểm duyệt.
            </p>
          </div>
        </div>
        <div className="toggle-section">
          <h3 className="heading-section">Bật lọc an toàn Gemini API</h3>
          <ToggleSwitch
            enabled={settings.safetySettings.enabled}
            setEnabled={handleSafetyToggle}
          />
        </div>
        <div
          className={`opacity-disabled ${settings.safetySettings.enabled ? "opacity-100" : "opacity-50 pointer-events-none"}`}
        >
          <div className="grid-safety">
            {settings.safetySettings.settings.map(({ category, threshold }) => (
              <div key={category}>
                <label className="label-form">
                  {HARM_CATEGORIES[category]}
                </label>
                <select
                  value={threshold}
                  onChange={(e) =>
                    handleThresholdChange(
                      category,
                      e.target.value as HarmBlockThreshold,
                    )
                  }
                  className="select-base"
                >
                  {Object.entries(HARM_BLOCK_THRESHOLDS).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      </Accordion>

      <Accordion
        title="Hệ Thống Trí Nhớ Nâng Cao (RAG & Tóm Tắt)"
        icon={<Icon name="memory" />}
        borderColorClass="border-purple-500"
        titleClassName="text-purple-400"
      >
        <p className="text-desc">
          Cấu hình cách AI ghi nhớ và truy xuất thông tin dài hạn để chống quá
          tải token và giúp game chạy được hàng ngàn lượt.
        </p>
        <div className="space-section">
          <div>
            <label htmlFor="summary-frequency" className="label-form">
              Tần suất Tóm tắt Tự động (số lượt)
            </label>
            <input
              type="number"
              id="summary-frequency"
              value={settings.ragSettings.summaryFrequency}
              onChange={(e) =>
                handleRagSettingChange(
                  "summaryFrequency",
                  parseInt(e.target.value, 10),
                )
              }
              className="input-full"
              min="5"
            />
            <p className="text-small-desc">
              Cứ sau mỗi X lượt, AI sẽ tự động tóm tắt các diễn biến vừa qua.
            </p>
          </div>
          <div>
            <label htmlFor="top-k" className="label-form">
              Số kết quả RAG (Top K)
            </label>
            <input
              type="number"
              id="top-k"
              value={settings.ragSettings.topK}
              onChange={(e) =>
                handleRagSettingChange("topK", parseInt(e.target.value, 10))
              }
              className="input-full"
              min="1"
              max="10"
            />
            <p className="text-small-desc">
              Số lượng ký ức liên quan nhất AI sẽ truy xuất trong mỗi lượt chơi.
            </p>
          </div>
          <div className="toggle-rag">
            <h3 className="heading-section">
              Tóm tắt Lịch sử Truyện trước khi lia RAG
            </h3>
            <ToggleSwitch
              enabled={settings.ragSettings.summarizeBeforeRag}
              setEnabled={(val) =>
                handleRagSettingChange("summarizeBeforeRag", val)
              }
            />
          </div>
        </div>
      </Accordion>

      <Accordion
        title="Cài đặt Hiệu suất AI"
        icon={<Icon name="difficulty" />}
        borderColorClass="border-yellow-500"
        titleClassName="text-yellow-400"
      >
        <p className="text-desc">
          Điều chỉnh các thông số kỹ thuật của AI để cân bằng giữa chất lượng,
          tốc độ và chi phí. Chỉ dành cho người dùng nâng cao.
        </p>
        <div className="space-performance">
          <div>
            <label htmlFor="model-select" className="label-form">
              Model Dẫn Truyện
            </label>
            <select
              id="model-select"
              value={
                settings.aiPerformanceSettings.selectedModel ||
                "gemini-2.5-flash"
              }
              onChange={(e) =>
                handleAiPerformanceSettingChange(
                  "selectedModel",
                  e.target.value,
                )
              }
              className="select-yellow"
            >
              <option value="gemini-2.5-flash">
                Gemini 2.5 Flash (Tốc độ cao)
              </option>
              <option value="gemini-2.5-pro">
                Gemini 2.5 Pro (Tư duy sâu, văn phong tốt hơn)
              </option>
              <option value="gemini-3.1-pro-preview">
                Gemini 3.1 Pro (Siêu Trí Tuệ - Mới)
              </option>
              <option value="gemini-3-flash-preview">
                Gemini 3.0 Flash (Tốc độ cao - Thông minh hơn - Mới)
              </option>
              <option value="gemini-3.1-flash-lite-preview">
                Gemini 3.1 Flash Lite (Siêu tốc - Tiết kiệm - Mới)
              </option>
            </select>
            <div className="model-info">
              <p>
                <strong>Flash:</strong> Phản hồi nhanh, tiết kiệm ngân sách suy
                nghĩ. Phù hợp cho đa số người chơi.
              </p>
              <p>
                <strong>2.5 Pro:</strong> Khả năng suy luận sâu sắc, mạch văn
                chau chuốt hơn, nhưng tốc độ chậm hơn.
              </p>
              <p>
                <strong>3.1 Pro:</strong> Thế hệ mới. Thông minh và hiểu ngữ
                cảnh siêu dài, sáng tạo vượt trội, nhưng tốc độ rùa bò.{" "}
              </p>
              <p>
                <strong>3.0 Flash & 3.1 Flash Lite:</strong> Thế hệ mới, ngon
                hơn, vượt trội hơn flash cũ, tốc độ ngang nhau
              </p>
              <p>
                <span className="text-warning">
                  Lưu ý: Sử dụng model PRO sẽ kệ mẹ mấy cái tùy chỉnh ở dưới và
                  luôn chạy ở công suất tối đa.
                </span>
              </p>
            </div>
          </div>

          <div className={isHighEndModel ? "disabled-section" : ""}>
            <div className="slider-section">
              <div className="slider-label">
                <label htmlFor="max-tokens-input" className="label-form">
                  Độ dài Phản hồi Tối đa (Max Output Tokens)
                </label>
                <input
                  type="number"
                  id="max-tokens-input"
                  value={settings.aiPerformanceSettings.maxOutputTokens}
                  onChange={(e) =>
                    handleAiPerformanceSettingChange(
                      "maxOutputTokens",
                      e.target.value,
                    )
                  }
                  className="input-number"
                  min="1024"
                  max="65535"
                  step="256"
                />
              </div>
              <input
                type="range"
                id="max-tokens-slider"
                value={settings.aiPerformanceSettings.maxOutputTokens}
                onChange={(e) =>
                  handleAiPerformanceSettingChange(
                    "maxOutputTokens",
                    e.target.value,
                  )
                }
                className="slider-range"
                min="1024"
                max="65535"
                step="256"
              />
              <p className="text-small-desc">
                Giới hạn số token tối đa AI có thể tạo ra. Hữu ích cho cả việc
                tạo JSON và tường thuật. Mặc định: 8000.
              </p>
            </div>
            <div
              className={`slider-section ${isGen3Model && !isHighEndModel ? "disabled-section" : ""}`}
            >
              <div className="slider-label">
                <label htmlFor="thinking-budget" className="label-form">
                  Thinking Budget (dành cho thế hệ 2.0)
                </label>
                <input
                  type="number"
                  id="thinking-budget-input"
                  value={settings.aiPerformanceSettings.thinkingBudget}
                  onChange={(e) =>
                    handleAiPerformanceSettingChange(
                      "thinkingBudget",
                      e.target.value,
                    )
                  }
                  className="input-number"
                  min="0"
                  max={maxThinkingBudget}
                  step="100"
                />
              </div>
              <input
                type="range"
                id="thinking-budget-slider"
                value={settings.aiPerformanceSettings.thinkingBudget}
                onChange={(e) =>
                  handleAiPerformanceSettingChange(
                    "thinkingBudget",
                    e.target.value,
                  )
                }
                className="slider-range"
                min="0"
                max={maxThinkingBudget}
                step="100"
              />
              <p className="text-small-desc">
                Ngân sách suy nghĩ để AI thế hệ 2.0 xử lý các yêu cầu phức tạp.
                Mặc định: 1200.
              </p>
            </div>
            <div
              className={`slider-section ${!isGen3Model && !isHighEndModel ? "disabled-section" : ""}`}
            >
              <div className="slider-label">
                <label htmlFor="thinking-level-select" className="label-form">
                  Thinking Level (dành cho model thế hệ 3.0)
                </label>
                <select
                  id="thinking-level-select"
                  value={settings.aiPerformanceSettings.thinkingLevel}
                  onChange={(e) =>
                    handleAiPerformanceSettingChange(
                      "thinkingLevel",
                      e.target.value,
                    )
                  }
                  className="select-small"
                  style={{ minWidth: 360 }}
                >
                  <option value="None">None (tắt hoàn toàn suy nghĩ)</option>
                  <option value="Minimal" disabled>
                    Minimal (tối thiểu, không hỗ trợ)
                  </option>
                  <option value="Low">Low (thấp, tốn thời gian rất ít)</option>
                  <option value="Medium">
                    Medium (vừa phải, không tiêu hao quá nhiều thời gian)
                  </option>
                  <option value="High">
                    High (cao, tiêu tốn nhiều thời gian nhất)
                  </option>
                </select>
              </div>
              <p className="text-small-desc">
                Mức độ tự suy nghĩ của model thế hệ 3.0, thế hệ mới sẽ sử dụng
                mức độ suy nghĩ thay cho ngân sách
              </p>
            </div>
            <div className="slider-section">
              <div className="slider-label">
                <label htmlFor="json-buffer-input" className="label-form">
                  Độ dài Bổ sung cho JSON (jsonBuffer)
                </label>
                <input
                  type="number"
                  id="json-buffer-input"
                  value={settings.aiPerformanceSettings.jsonBuffer}
                  onChange={(e) =>
                    handleAiPerformanceSettingChange(
                      "jsonBuffer",
                      e.target.value,
                    )
                  }
                  className="input-number"
                  min="0"
                  max="8192"
                  step="128"
                />
              </div>
              <input
                type="range"
                id="json-buffer-slider"
                value={settings.aiPerformanceSettings.jsonBuffer}
                onChange={(e) =>
                  handleAiPerformanceSettingChange("jsonBuffer", e.target.value)
                }
                className="slider-range"
                min="0"
                max="8192"
                step="128"
              />
              <p className="text-small-desc">
                Thêm token dự phòng để đảm bảo AI có đủ không gian cho cấu trúc
                dữ liệu game (JSON), tránh lỗi. Giá trị này sẽ được cộng thêm
                vào giới hạn token cuối cùng khi gọi AI. Mặc định: 1024.
              </p>
            </div>
          </div>
          {isHighEndModel && (
            <div className="pro-notice">
              <p className="text-yellow-sm">Đang sử dụng Model Cao Cấp (Pro)</p>
              <p className="text-yellow-xs">
                Hệ thống đã tự động ưu hóa ở mức tối đa.
              </p>
            </div>
          )}
        </div>
      </Accordion>

      <div className="save-container">
        <Button onClick={handleSave} variant="primary" className="btn-save">
          Lưu Thay Đổi & Quay Lại
        </Button>
      </div>
    </div>
  );
};

export default SettingsScreen;
