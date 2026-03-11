import React from "react";
import "#/assets/toggle_switch.css";

interface ToggleSwitchProps {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, setEnabled }) => {
  return (
    <button
      type="button"
      className={`${
        enabled ? "bg-purple-600" : "bg-slate-700"
      } toggle_switch_btn`}
      role="switch"
      aria-checked={enabled}
      onClick={() => setEnabled(!enabled)}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={`${
          enabled ? "translate-x-5" : "translate-x-0"
        } toggle_switch_transition`}
      />
    </button>
  );
};

export default ToggleSwitch;
