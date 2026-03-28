import React from "react";
import Icon from "./Icon";
import "#/assets/entity_modal.css";

interface EntityInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string | null;
  description: string | null;
  type: string | null;
  details?: InitialEntity["details"];
  // Bổ sung dữ liệu Quest mở rộng nếu có
  questData?: any;
}

const EntityInfoModal: React.FC<EntityInfoModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  type,
  details,
  questData,
}) => {
  if (!isOpen || !title) return null;

  const stripTags = (text: string | null): string => {
    if (!text) return "Không có mô tả chi tiết.";
    // Specifically remove game-related tags, leaving other potential HTML untouched.
    return text.replace(/<\/?(entity|important|exp|thought|status)>/g, "");
  };

  const RarityColor: { [key: string]: string } = {
    "Phổ thông": "text-slate-300",
    "Không phổ biến": "text-green-400",
    Hiếm: "text-blue-400",
    "Sử thi": "text-purple-400",
    "Huyền thoại": "text-orange-400",
  };

  const isQuest = type === "Nhiệm Vụ" || type === "Quest";

  return (
    <div className="entity_modal_main_div" onClick={onClose}>
      <div className="entity_modal_second_div" onClick={(e) => e.stopPropagation()}>
        <div className="entity_modal_header">
          <div className="entity_modal_title_container">
            <h2 className="entity_modal_title">{stripTags(title)}</h2>
            {type && !isQuest && (
              <p className="entity_modal_type">
                {type}
                {details?.subType && ` - ${details.subType}`}
              </p>
            )}
            {details?.rarity && (
              <p
                className={`entity_modal_rarity ${RarityColor[details.rarity] || "text-slate-300"}`}
              >
                {details.rarity}
              </p>
            )}

            {/* Quest Header */}
            {isQuest && questData && (
              <div className="entity_modal_quest_header">
                {questData.type && (
                  <span
                    className={`entity_modal_quest_type ${
                      questData.type === "MAIN"
                        ? "entity_modal_quest_type_main"
                        : questData.type === "SIDE"
                          ? "entity_modal_quest_type_main"
                          : "entity_modal_quest_type_personal"
                    }`}
                  >
                    {questData.type === "MAIN"
                      ? "Cốt Truyện"
                      : questData.type === "SIDE"
                        ? "Phụ Tuyến"
                        : "Cá Nhân"}
                  </span>
                )}
                <span
                  className={`entity_modal_quest_status ${
                    questData.status === "hoàn thành"
                      ? "entity_modal_quest_status_finished"
                      : questData.status === "thất bại"
                        ? "entity_modal_quest_status_failed"
                        : "entity_modal_quest_status_ongoing"
                  }`}
                >
                  {questData.status === "hoàn thành"
                    ? "Đã Hoàn Thành"
                    : questData.status === "thất bại"
                      ? "Thất Bại"
                      : "Đang Tiến Hành"}
                </span>
              </div>
            )}
          </div>
          <button onClick={onClose} className="entity_modal_close_btn">
            <Icon name="xCircle" className="entity_modal_icon_close" />
          </button>
        </div>

        <div className="entity_modal_content">
          {/* Quest Specific Content */}
          {isQuest && questData ? (
            <>
              {/* 1. Mục tiêu hiện tại */}
              {questData.currentObjective && questData.status !== "hoàn thành" && (
                <div className="entity_modal_objective">
                  <p className="entity_modal_objective_label">Mục Tiêu Hiện Tại</p>
                  <p className="entity_modal_objective_text">{questData.currentObjective}</p>
                </div>
              )}

              {/* 2. Checklist (Subtasks) */}
              {questData.subTasks && questData.subTasks.length > 0 && (
                <div>
                  <p className="entity_modal_checklist_label">Danh sách công việc</p>
                  <ul className="entity_modal_checklist">
                    {questData.subTasks.map((task: any, idx: number) => (
                      <li
                        key={idx}
                        className={`entity_modal_task ${task.isCompleted ? "entity_modal_task_completed" : "entity_modal_task_pending"}`}
                      >
                        <div
                          className={`entity_modal_task_checkbox ${task.isCompleted ? "entity_modal_task_checkbox_completed" : "entity_modal_task_checkbox_pending"}`}
                        >
                          {task.isCompleted && (
                            <Icon name="checkCircle" className="entity_modal_task_icon" />
                          )}
                        </div>
                        <span
                          className={
                            task.isCompleted
                              ? "entity_modal_task_desc_completed"
                              : "entity_modal_task_desc_pending"
                          }
                        >
                          {task.desc}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 3. Mô tả chung */}
              <div>
                <p className="entity_modal_desc_label">Mô tả</p>
                <p className="entity_modal_desc_text">{stripTags(description)}</p>
              </div>

              {/* 4. Nhật ký hành trình (Logs) */}
              {questData.logs && questData.logs.length > 0 && (
                <div className="entity_modal_logs">
                  <p className="entity_modal_logs_label">
                    <Icon name="news" className="w-3 h-3" /> Nhật Ký Hành Trình
                  </p>
                  <ul className="entity_modal_logs_list">
                    {questData.logs.map((log: string, idx: number) => (
                      <li key={idx} className="entity_modal_log_item">
                        <div className="entity_modal_log_bullet"></div>
                        {log}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            // Default content for non-quest entities
            <>
              <p className="entity_modal_default_desc">
                {stripTags(description) || "Không có mô tả chi tiết."}
              </p>

              {details && (
                <div className="entity_modal_details">
                  {details.stats && (
                    <div>
                      <strong className="entity_modal_detail_label">Chỉ số:</strong>
                      <div className="entity_modal_detail_content">
                        <p className="entity_modal_detail_stats">{details.stats}</p>
                      </div>
                    </div>
                  )}
                  {details.effects && (
                    <div>
                      <strong className="entity_modal_detail_label">Hiệu ứng đặc biệt:</strong>
                      <div className="entity_modal_detail_content">
                        <p className="entity_modal_detail_effects">{details.effects}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EntityInfoModal;
