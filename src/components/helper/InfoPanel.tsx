import React, { useState } from "react";
import Icon from "./Icon";
import "#/assets/info_panel.css";

interface InfoPanelProps {
  title: string;
  iconName: any;
  children: React.ReactNode;
  borderColorClass?: string;
  textColorClass?: string;
  isInitiallyOpen?: boolean;
}

const InfoPanel: React.FC<InfoPanelProps> = ({
  title,
  iconName,
  children,
  borderColorClass = "border-yellow-500",
  textColorClass = "text-yellow-400",
  isInitiallyOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(isInitiallyOpen);

  return (
    <div className={`info_panel_main_div ${borderColorClass}`}>
      <button onClick={() => setIsOpen(!isOpen)} className="info_panel_btn">
        <div className="info_panel_btn_div">
          <div className="info_panel_btn_div_b">
            <Icon name={iconName} className="info_panel_btn_icon" />
            <h3 className={`info_panel_btn_title ${textColorClass}`}>{title}</h3>
          </div>
          <Icon name={isOpen ? "arrowUp" : "arrowDown"} className="info_panel_btn_arrow" />
        </div>
      </button>

      <div
        className={`info_panel_children_outer_div ${isOpen ? "max-h-125 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="info_panel_children_inner_div">{children}</div>
      </div>
    </div>
  );
};

export default InfoPanel;
