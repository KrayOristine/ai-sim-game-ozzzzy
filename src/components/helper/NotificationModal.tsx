import React from "react";
import Button from "./Button";
import Icon from "./Icon";
import "#/assets/notification_modal.css";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  messages: string[];
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  title,
  messages,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="notification_modal"
      onClick={onClose}
    >
      <div
        className=""
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="notification_modal_box">
          <div className="notification_modal_box_icon_box">
            <Icon name="warning" className="notification_modal_box_icon" />
          </div>
          <div className="notification_modal_msg_container">
            <h2 className="notification_modal_title">{title}</h2>
            <div className="notification_modal_message">
              {messages.map((msg, index) => (
                <p key={index}>{msg}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="notification_modal_btn_box">
          <Button
            onClick={onClose}
            variant="warning"
            className="notification_modal_btn"
          >
            Đã hiểu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
