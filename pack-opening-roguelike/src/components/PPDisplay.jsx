import './PPDisplay.css';

const PPDisplay = ({ pp, ppPerSecond }) => {
  return (
    <div className="pp-display">
      <div className="pp-amount">
        <span className="pp-label">Power Points</span>
        <span className="pp-value">{pp}</span>
      </div>
      <div className="pp-rate">
        <span className="pp-per-second">+{ppPerSecond.toFixed(1)} PP/s</span>
      </div>
    </div>
  );
};

export default PPDisplay;