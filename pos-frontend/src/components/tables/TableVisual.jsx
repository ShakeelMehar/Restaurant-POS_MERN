import React from "react";
import "./TableVisual.css";

/**
 * Visual table component that renders a table with chairs.
 * Supports 1 to 8 seats with appropriate layouts.
 *
 * @param {number} seats - Number of seats (1-8)
 * @param {string} status - "Available" | "Booked"
 * @param {string} label - Text to show on the table (e.g. "A1", initials)
 * @param {string} tableNo - Table number to display
 */
const TableVisual = ({ seats = 2, status = "Available", label, tableNo }) => {
  const clampedSeats = Math.max(1, Math.min(8, seats));
  const statusClass = status === "Booked" ? "tv--booked" : "tv--available";

  // Determine table shape based on seat count
  const getTableShape = () => {
    if (clampedSeats <= 2) return "tv__surface--small";
    if (clampedSeats <= 4) return "tv__surface--medium";
    if (clampedSeats <= 6) return "tv__surface--large";
    return "tv__surface--xlarge";
  };

  // Generate chair positions based on seat count
  const renderChairs = () => {
    const chairs = [];

    switch (clampedSeats) {
      case 1:
        chairs.push(<div key="t" className="tv__chair tv__chair--top" />);
        break;

      case 2:
        chairs.push(<div key="l" className="tv__chair tv__chair--left" />);
        chairs.push(<div key="r" className="tv__chair tv__chair--right" />);
        break;

      case 3:
        chairs.push(<div key="t" className="tv__chair tv__chair--top" />);
        chairs.push(<div key="bl" className="tv__chair tv__chair--bottom-left" />);
        chairs.push(<div key="br" className="tv__chair tv__chair--bottom-right" />);
        break;

      case 4:
        chairs.push(<div key="t" className="tv__chair tv__chair--top" />);
        chairs.push(<div key="r" className="tv__chair tv__chair--right" />);
        chairs.push(<div key="b" className="tv__chair tv__chair--bottom" />);
        chairs.push(<div key="l" className="tv__chair tv__chair--left" />);
        break;

      case 5:
        chairs.push(<div key="tl" className="tv__chair tv__chair--top-left" />);
        chairs.push(<div key="tr" className="tv__chair tv__chair--top-right" />);
        chairs.push(<div key="r" className="tv__chair tv__chair--right" />);
        chairs.push(<div key="bl" className="tv__chair tv__chair--bottom-left" />);
        chairs.push(<div key="br" className="tv__chair tv__chair--bottom-right" />);
        break;

      case 6:
        chairs.push(<div key="tl" className="tv__chair tv__chair--top-left" />);
        chairs.push(<div key="tr" className="tv__chair tv__chair--top-right" />);
        chairs.push(<div key="r" className="tv__chair tv__chair--right" />);
        chairs.push(<div key="bl" className="tv__chair tv__chair--bottom-left" />);
        chairs.push(<div key="br" className="tv__chair tv__chair--bottom-right" />);
        chairs.push(<div key="l" className="tv__chair tv__chair--left" />);
        break;

      case 7:
        chairs.push(<div key="tl" className="tv__chair tv__chair--top-left" />);
        chairs.push(<div key="tc" className="tv__chair tv__chair--top" />);
        chairs.push(<div key="tr" className="tv__chair tv__chair--top-right" />);
        chairs.push(<div key="r" className="tv__chair tv__chair--right" />);
        chairs.push(<div key="bl" className="tv__chair tv__chair--bottom-left" />);
        chairs.push(<div key="br" className="tv__chair tv__chair--bottom-right" />);
        chairs.push(<div key="l" className="tv__chair tv__chair--left" />);
        break;

      case 8:
        chairs.push(<div key="tl" className="tv__chair tv__chair--top-left" />);
        chairs.push(<div key="tc" className="tv__chair tv__chair--top" />);
        chairs.push(<div key="tr" className="tv__chair tv__chair--top-right" />);
        chairs.push(<div key="r" className="tv__chair tv__chair--right" />);
        chairs.push(<div key="bl" className="tv__chair tv__chair--bottom-left" />);
        chairs.push(<div key="bc" className="tv__chair tv__chair--bottom" />);
        chairs.push(<div key="br" className="tv__chair tv__chair--bottom-right" />);
        chairs.push(<div key="l" className="tv__chair tv__chair--left" />);
        break;

      default:
        break;
    }

    return chairs;
  };

  return (
    <div className={`tv ${statusClass}`} title={`Table ${tableNo} — ${seats} seats — ${status}`}>
      <div className="tv__chairs-container">
        {renderChairs()}
        <div className={`tv__surface ${getTableShape()}`}>
          <span className="tv__label">{label || `T${tableNo}`}</span>
        </div>
      </div>
    </div>
  );
};

export default TableVisual;
