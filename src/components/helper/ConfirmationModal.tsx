import React from "react";
import Button from "./Button";
import Icon from "./Icon";
import type { IconName } from "./Icon";
import "#/assets/confirm_modal.css";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Xác Nhận",
  cancelLabel = "Hủy Bỏ",
  variant = "danger",
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const config: {
    icon: IconName;
    color: string;
    btn_variant: "warning" | "special" | "primary";
  } = {
    icon: "info",
    color: "",
    btn_variant: "primary",
  };

  switch (variant) {
    case "danger":
      config.icon = "trash";
      config.color = "text-red-400";
      config.btn_variant = "warning";
      break;
    case "warning":
      config.icon = "warning";
      config.color = "text-amber-400";
      config.btn_variant = "special";
      break;
    case "info":
      config.icon = "info";
      config.color = "text-blue-400";
      config.btn_variant = "primary";
      break;
  }

  return (
    <div className="confirm_modal_main_div" onClick={onClose}>
      <div
        className="confirm_modal_second_div"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start mb-4">
          <div className={`shrink-0 mr-3 ${config.color}`}>
            <Icon name={config.icon} className="w-8 h-8" />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${config.color}`}>{title}</h2>
            <div className="confirm_modal_message_div">{message}</div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="confirm_modal_close_btn">
            {cancelLabel}
          </button>
          <Button
            onClick={handleConfirm}
            variant={config.btn_variant} // Use mapped variant
            className="confirm_modal_click_btn"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
