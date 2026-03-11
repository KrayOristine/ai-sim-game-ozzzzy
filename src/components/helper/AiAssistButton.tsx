import React from "react";
import Icon from "./Icon";
import "#/assets/ai_assist.css";

interface AiAssistButtonProps {
  isLoading: boolean;
  onClick: () => void;
  className?: string;
  isFullWidth?: boolean;
  children?: React.ReactNode;
}

const AiAssistButton: React.FC<AiAssistButtonProps> = ({
  isLoading,
  onClick,
  className = "",
  isFullWidth = false,
  children,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`ai_assist_btn ${className} ${isFullWidth ? "w-full" : ""} ${children ? "px-3 py-2" : "p-1.5"}`}
      title="Hỗ trợ tạo bằng AI"
    >
      {isLoading ? (
        <svg
          className="animate-spin h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        <>
          <Icon name="magic" className="icon-sm" />
          {children && <span className="ml-2">{children}</span>}
        </>
      )}
    </button>
  );
};

export default AiAssistButton;
