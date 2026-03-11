import React, { useState, ReactNode } from "react";
import "#/assets/accordion.css";

interface AccordionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  startOpen?: boolean;
  titleClassName?: string;
  borderColorClass?: string;
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  icon,
  children,
  startOpen = false,
  titleClassName = "text-slate-100",
  borderColorClass = "border-transparent",
}) => {
  const [isOpen, setIsOpen] = useState(startOpen);

  return (
    <div className={`accord_main_div ${borderColorClass}`}>
      <button onClick={() => setIsOpen(!isOpen)} className="accord_btn">
        <div className="flex items-center">
          <span className={`mr-3 ${titleClassName}`}>{icon}</span>
          <h3 className={`text-xl font-bold text-left ${titleClassName}`}>
            {title}
          </h3>
        </div>
        <svg
          className={`accord_svg ${titleClassName} ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`accord_child_div ${
          isOpen ? "max-h-500 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-4">{children}</div>
      </div>
    </div>
  );
};

export default Accordion;
