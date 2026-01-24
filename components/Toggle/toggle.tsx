import React, { useState } from "react";

interface ToggleSwitchProps {
  dialogIndex: number;
  index: number;
  isEnabled: boolean;
  onToggle: (dialogIndex: number, index: number, isYes: boolean) => void;
}
const ToggleSwitch = ({
  dialogIndex,
  index,
  isEnabled,
  onToggle,
}: ToggleSwitchProps) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <span
        style={{
          marginRight: "10px",
          color: isEnabled ? "var(--color-green1)" : "var(--color-orange1)",
          width: "30px",
        }}
      >
        {isEnabled ? "Yes" : "No"}
      </span>
      <button
        onClick={() => {
          onToggle(dialogIndex, index, !isEnabled);
        }}
        style={{
          width: "50px",
          height: "30px",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
          backgroundColor: isEnabled ? "var(--color-green5)" : "#dadada",
          position: "relative",
          transition: "background-color 0.3s",
          outline: "none", // Remove outline for better aesthetic, but consider accessibility
        }}
        aria-pressed={isEnabled} // Essential for screen readers
        aria-label={isEnabled ? "Enabled" : "Disabled"}
      >
        <div
          style={{
            position: "absolute",
            top: "5px",
            left: isEnabled ? "25px" : "5px",
            width: "20px",
            height: "20px",
            borderRadius: "10%",
            backgroundColor: "white",
            transition: "left 0.3s",
          }}
        />
      </button>
    </div>
  );
};

export default ToggleSwitch;
